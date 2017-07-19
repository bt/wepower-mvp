# We Power

## Modules.
* _web-backend_  - Spring boot project for back end.
* _web-fronted_ -  Angular4 project for front end.
* _smart-contracts_ - Truffle project. Used to handle contract deployment/management.

### Backend
Backend is based on JVM stack. Spring 4

#### Local environment setup
navigate to web-backend folder and run:
 gradle bootRun

For local development, in memmory database will be automatically started.

### Frontend

#### Local environment setup
In order to deploy frontend:

1. Ethereum network must be running and accesible at localhost:8545.
In order to achieve that start private network, or testrpc
2. After starting etherium network start frontend application in _web-frontend_ module with commands:
**npm run clean_start**
      Clean start will compile, deploy and fetch contracts, and integrate them into angular app and deploy frontend application. 
 _(To run this task Ethereum network must be accessible, for contract deployment)_
**npm run start**
      Will only deploy angular application. Use when contracts were previously compiled/deployed etc, and no changes were made.