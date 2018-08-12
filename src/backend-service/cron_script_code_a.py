import requests, json, os, datetime, pprint
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
import config

status = 'failed'

# initialization of logging handler
def logger_function():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)

    # create a file handler
    handler = logging.FileHandler(config.CRON_LOG)
    handler.setLevel(logging.INFO)

    # create a logging format
    formatter = logging.Formatter('%(asctime)s -- %(message)s')
    handler.setFormatter(formatter)

    # clear handler if exist
    if (logger.hasHandlers()):
        logger.handlers.clear()

    # add the handlers to the logger
    logger.addHandler(handler)

    return logger


# fetching data for each city
def data_collector(city):
    global status
    url = config.URL+city+'&appid='+config.API_KEY
    try:
        api_response = requests.get(url)
        if api_response.status_code == 200:
            formatted_response = json.loads(api_response.text)
            status = 'success'
            return formatted_response
        else:
            print('weather api return error')
    except Exception as e:
        print(e)

    return None


# Calculate metadata for each call
def metadata_calculator(all_data):
    all_data_no_null = []
    column_count = 0
    for city_data in all_data:
        if city_data != None:
            column_count += len(city_data)
            all_data_no_null.append(city_data)
    return all_data_no_null, column_count


# Trigger processing of fetched data
def call_processing_service():
    global status
    cron_logger = logger_function()
    start_time = datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S')
    all_weather_data = map(data_collector, config.CITY)
    all_weather_data_no_null, column_cnt = metadata_calculator(all_weather_data)
    headers = {'content-type':'application/json'}
    trigger_time = datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S')
    request_processing = requests.post(config.SERVICE_URL+str(config.PORT)+'/download/', headers=headers, json=all_weather_data_no_null)
    if request_processing.status_code==200:
        log_msg = start_time+' -- '+trigger_time+ ' -- '+str(len(
            all_weather_data_no_null))+ ' -- '+ str(column_cnt) + ' -- success ' + '-- '+status
        cron_logger.info(log_msg)
    else:
        log_msg = start_time + ' -- ' + trigger_time + ' -- ' + str(len(
            all_weather_data_no_null)) + ' -- ' + str(column_cnt) + ' -- failed ' + '-- '+status
        cron_logger.info(log_msg)
    logging.shutdown()


if __name__ == '__main__':
    scheduler = BlockingScheduler()
    scheduler.add_job(call_processing_service, 'interval', seconds=2*60*60)
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass