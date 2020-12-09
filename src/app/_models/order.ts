export class Order {
    public orderId: String;
    public title: String;

    public sourceLatitude : Number;
    public sourceLongitude : Number;

    public destinationLatitude: Number;
    public destinationLongitude: Number;

    public volume: Number;
    public weight: Number;
    public plate: String;
    public description : String
    public deadline: String;
    public admins_id: String;
    public admins_name: String;
    public driver_id: String;
    public driver_name: String;

    public status: String;
}
