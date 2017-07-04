import { Injectable } from '@angular/core';
import { ConsumerForm } from "./consumer-form/consumer-form";

@Injectable()
export class ConsumerManagementService {

  constructor() { }

  createConsumer(plantData : ConsumerForm): void {
    //  TODO: Issue request to backend.
  }

}
