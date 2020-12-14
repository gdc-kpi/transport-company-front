export class Order {
    

    // public source;
    // public destination;
    // public volume: String;
    // public weight: String;
    // public car_id: String;
    // public description : String;
    // public admins_id : String;
    // public deadline: String;
    // public status: String;
    // public title: String;

    public orderId: string;
    public title: string;

    public sourceLatitude: number;
    public sourceLongitude: number;

    public destinationLatitude: number;
    public destinationLongitude: number;

    public volume: number;
    public weight: number;
    public plate: string;
    public description: string;
    public deadline: string;
    public adminsId: string;
    public adminsName: string;
    public driverId: string;
    public driverName: string;

    public status: string;
}
