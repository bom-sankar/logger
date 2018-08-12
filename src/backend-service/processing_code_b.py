__author__ = 'sankar'


from flask import Flask, jsonify, make_response, request
from pymongo import MongoClient
import json, datetime, os
import logging
import pandas as pd
import numpy as np
import config

db_conn = MongoClient(config.DB_URL, config.DB_PORT)
app = Flask(__name__)


@app.route('/download/', methods=['POST'])
def download():
    start_time = datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S')
    # getting the metadata from existing log file
    def meta_data_existing():
        i = 0
        try:
            with open(config.PROC_LOG) as file:
                for line in file:
                    print(line[0:5])
                    if line[0:5] == 'DEBUG':
                        i +=1
            return i
        except Exception as e:
            print("error in reading file ==", e)
        return 0

    insert_json = {
        'created_time':datetime.datetime.now(),
        'city_temp':[]
    }
    col_cnt = 0
    request_data = request.get_json()
    for city_data in request_data:
        insert_json['city_temp'].append({
            'city':city_data['name'],
            'max_temp':city_data['main']['temp_max']
        })
        col_cnt +=len(city_data)

    document_cnt = db_conn.weather_data['city_max_temp'].find({}).count()
    existing_row = meta_data_existing()

    try:
        respose_id = db_conn.weather_data['city_max_temp'].insert(insert_json)
        log_msg = '{start_tm} -- {curr_time} -- {exist} -- {now} -- {doc_cnt} -- {doc_id} -- success'.format(
            start_tm = start_time, curr_time = datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S'),exist=existing_row,
            now=len(request_data), doc_cnt=document_cnt+1, doc_id=respose_id)
        app.logger.debug(log_msg)
    except Exception as e:
        log_msg = '{start_tm} -- {curr_time} -- {exist} -- {now} -- {doc_cnt} -- {doc_id} -- success'.format(
            start_tm=start_time, curr_time=datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S'),exist=existing_row,
            now=len(request_data), doc_cnt=document_cnt, doc_id='None')
        app.logger.debug(log_msg)
        print("==========insertion to db failed===================")
        print(e)
    return jsonify(request_data)


@app.route('/dashboard/', methods=['GET'])
def dashboard():
    try:
        # reading the files
        proc_list = []
        with open(config.PROC_LOG) as proc_log:
            for line in proc_log:
                print(line[0:5])
                if line[0:5]=='DEBUG':
                    temp_line = line.replace('DEBUG:flask.app:', '')
                    proc_list.append([col_val.strip() for col_val in temp_line.split('--')])

        cron_list = []
        with open(config.CRON_LOG) as cron_log:
            for line in cron_log:
                cron_list.append([col_val.strip() for col_val in line.split('--')])

        # convert to dataframe
        proc_df = pd.DataFrame(proc_list, columns=config.PROC_COL)
        cron_df = pd.DataFrame(cron_list, columns=config.CRON_COL)

        # change dtypes of df
        proc_df[['exist_col', 'new_col', 'doc_cnt']] = proc_df[['exist_col', 'new_col', 'doc_cnt']].apply(
            pd.to_numeric
        )
        proc_df['proc_time'] = pd.to_datetime(proc_df['proc_time'], format='%Y/%m/%d %H:%M:%S')
        proc_df['start_time'] = pd.to_datetime(proc_df['start_time'], format='%Y/%m/%d %H:%M:%S')

        cron_df[['row', 'col']] = cron_df[['row', 'col']].apply(pd.to_numeric)
        cron_df['start_time'] = pd.to_datetime(cron_df['start_time'], format='%Y/%m/%d %H:%M:%S')
        cron_df['trig_time'] = pd.to_datetime(cron_df['trig_time'], format='%Y/%m/%d %H:%M:%S')

        # new diff of time column
        proc_df['exec_time'] = (proc_df['proc_time']-proc_df['start_time'])/np.timedelta64(1, 's')
        cron_df['exec_time'] = (cron_df['trig_time'] - cron_df['start_time'])/np.timedelta64(1, 's')

        proc_df = proc_df.sort_values(by='start_time', ascending=False)
        cron_df = cron_df.sort_values(by='start_time', ascending=False)

        # calculating values
        proc_total_call = proc_df.shape[0]
        proc_succ_call = proc_df[proc_df['status']=='success'].shape[0]
        proc_fail_call = proc_df[proc_df['status']=='failed'].shape[0]

        cron_total_call = cron_df.shape[0]
        cron_succ_call = cron_df[cron_df['status'] == 'success'].shape[0]
        cron_fail_call = cron_df[cron_df['status'] == 'failed'].shape[0]

        response_json = {
            'proc': {
                'total_call': proc_total_call,
                'succ_call': proc_succ_call,
                'failed_call': proc_fail_call,
                'data': proc_df.head(5).values.tolist()
            },
            'cron': {
                'total_call': cron_total_call,
                'succ_call': cron_succ_call,
                'failed_call': cron_fail_call,
                'data': cron_df.head(5).values.tolist()
            }
        }
        print("====response=====", response_json)
        return jsonify(response_json)
    except Exception as e:
        return jsonify({}), 401


@app.route('/weather/', methods=['GET'])
def weather():
    try:
        latest_weather_data = db_conn.weather_data['city_max_temp'].find({}).sort([('created_time', -1)]).limit(1)
        for weather_data in latest_weather_data:
            weather_data.pop('_id',None)
            temp_list = [temp['max_temp'] for temp in weather_data['city_temp']]
            city_list = [temp['city'] for temp in weather_data['city_temp']]
            weather_data['max'] = weather_data['city_temp'][temp_list.index(max(temp_list))]
            weather_data['min'] = weather_data['city_temp'][temp_list.index(min(temp_list))]
            weather_data['cities'] = city_list
            weather_data['temps'] = temp_list
            return jsonify(weather_data)
    except Exception as e:
        return jsonify({}), 401

@app.errorhandler(404)
def not_found(error):
    return make_response(json.dumps({'error': 'Not found'}), 404)


if __name__ == '__main__':

    logging.basicConfig(filename=config.PROC_LOG, level=logging.DEBUG)

    app.run(host= '0.0.0.0', port=config.PORT, debug=True)