# Run a test server.
from app import app
app.run(threaded=True, host='0.0.0.0', port=5253, debug=True)
