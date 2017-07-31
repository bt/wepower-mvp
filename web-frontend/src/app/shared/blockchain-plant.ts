import {PlantType} from "../registration/plant-form/plant-form";
import {PredictionData} from "../registration/prediction/prediction-data";

export class BlockchainPlantData {

    price: number
    source: PlantType
    predictions: Array<PredictionData>

    constructor(
        price? : number,
        source? : PlantType,
        predictions? : Array<PredictionData>
    ) {
        this.price = price;
        this.source = source;
        this.predictions = predictions;
    }

}
