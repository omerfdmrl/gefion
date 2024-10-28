module.exports = {
  "provider": "smtp1",
  "templates": "/home/omer/Desktop/Gefion2/resources/templates/",
  "smtp1": {
    "provider": "smtp",
    "from": "test@gefion.com",
    "host": "sandbox.smtp.mailtrap.io",
    "port": 2525,
    "pool": true,
    "maxConnections": 1,
    "rateDelta": 20000,
    "rateLimit": 5,
    "auth": {
      "user": "6101d0adc3cfdd",
      "pass": "9601edcfa606b9"
    }
  }
}