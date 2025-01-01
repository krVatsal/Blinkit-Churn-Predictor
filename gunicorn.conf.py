# Gunicorn configuration file
workers = 1
timeout = 120
bind = "0.0.0.0:10000"

# Recommended for ML models
worker_class = 'sync'
threads = 4

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 50