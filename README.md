# We Power

## Modules.
* _web-backend_  - Spring boot project for back end.
* _web-fronted_ -  Angular4 project for front end.
* _smart-contracts_ - Truffle project. Used to handle contract deployment/management.

### Backend
Backend is based on JVM stack. Spring 5
#### Local environment setup
as any other spring boot app with gradle bootRun task.

### Frontend

#### Local environment setup
In order to deploy frontend:

1. Etherium network must be running and accesible at localhost:8545.
In order to achieve that start private network, or testrpc
2. After starting etherium network start front end application in _web-frontend_ module.

**npm run clean_start**
      Clean start will compile, and fetch contracts, and integrate them into angular app and start front end application.
**npm run start**
      Use when developing only angluar app. Will only redeploy angular app. Use when contracts were previously compiled/deployed etc.