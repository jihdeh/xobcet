#!/bin/bash
sleep 10

echo mongo_setup.sh time now: `date +"%T" `
mongo --host mongodb-primary:27017 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongodb-primary:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "mongodb-secondary:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "mongodb-secondary-cluster:27017",
        "priority": 0
      }
    ]
  };
  rs.initiate(cfg, { force: true });
  rs.reconfig(cfg, { force: true });
  db.getMongo().setReadPref('nearest');
  db.setLogLevel('5')
EOF