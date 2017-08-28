export class TransactionData {

    constructor(
        public plant: string,
        public consumer: string,
        public date: Date,
        public transactionId: string,
        public amountEth: number,
        public amountKwh: number
    ) {
    }

}
