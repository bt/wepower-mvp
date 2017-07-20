import { PlantType } from "../registration/plant-form/plant-form";
import { WalletType } from "../shared/wallet-type.enum";

export class WalletDetails {
  constructor(public walletAddress: string,
              public walletType: WalletType,
              public plantType: PlantType) {

  }
}
