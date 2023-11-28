import assert from "assert";
import SalonBooking from "../services/salon-booking.js";
import pgPromise from "pg-promise";

// TODO configure this to work.
const DATABASE_URL = process.env.DB_TEST || "postgres://xpjmzeis:0X_fgEfUzNTepNI-DtLv8w1fgSCwppSm@cornelius.db.elephantsql.com/xpjmzeis";

const config = {
    connectionString: DATABASE_URL,
};

const pgp = pgPromise();
const db = pgp(config);

describe("The Booking Salon", function () {
    this.timeout(10000);

    // Service instance
    const booking = SalonBooking(db);

    // Treatment codes
    const treatmentCodes = {
        Pedicure: "001",
        Manicure: "002",
        MakeUp: "003",
        BrowsAndLashes: "004",
    };

    beforeEach(async function () {
        await db.none("truncate table bookings restart identity cascade");
        await db.none("truncate table treatments_made restart identity cascade");
    });

    it("should be able to list all the available treatments", async function () {
        const treatments = await booking.findAllTreatments();

        assert.deepEqual(
            [
                {
                  treatment_id: 1,
                  treatment_type: 'Pedicure',
                  code: '001',
                  price: '175'
                },
                {
                  treatment_id: 2,
                  treatment_type: 'Manicure',
                  code: '002',
                  price: '215'
                },
                {
                  treatment_id: 3,
                  treatment_type: 'Make up',
                  code: '003',
                  price: '185'
                },
                {
                  treatment_id: 4,
                  treatment_type: 'Brows & Lashes',
                  code: '004',
                  price: '240'
                }
              ],
            treatments
        );
    });

    it("should be able to find a treatment", async () => {
        const treatment = await booking.findTreatment(treatmentCodes.MakeUp);

        assert.deepEqual(
            {
                treatment_type: "Make up",
                code: '003',
                price: '185',
                treatment_id: 3
            }, treatment);
    });

    it("should be able to find a stylist using a phone number", async function () {
        const stylist = await booking.findStylist("0786457736");
        assert.deepEqual(
            {
                commission_percentage: "7",
                stylist_first_name: "Sino",
                stylist_last_name: "Mguli",
                phone_number: "0786457736",
                stylist_id: 1,
            },
            stylist
        );
    });

    it("should be able to allow a client to make a booking", async function () {
        // First check if client exist
        const client = await booking.findClient("Mthunzi");

        const stylist = await booking.findStylist("0786457736");

        // Clients makes Pedicure booking
        const makeAbooking = {
            date: "2023-12-01",
            time: "10:30",
            booked: true,
            clientId: client.client_id,
            stylistId: stylist.stylist_id,
            treatmentCode: treatmentCodes.Pedicure,
        };

        // Make client booking
        await booking.makeBooking(makeAbooking);

        const bookings = await booking.findClientBookings(makeAbooking);

        assert.deepEqual(
            [
                {
                    booking_date: "2023-12-01",
                    booking_time: "10:30:00",
                    treatment_type: "Pedicure",
                    treatment_id: 1,
                    client_first_name: "Mthunzi",
                    client_last_name: "Tom",
                    stylist_first_name: "Sino",
                    stylist_last_name: "Mguli",
                },
            ],
            bookings
        );
    });

    it("should be able to get client booking(s)", async function () {
        // First check if client exist
        const client = await booking.findClient("Mthunzi");
        const client2 = await booking.findClient("Katlego");

        const stylist = await booking.findStylist("0786457736");
        const stylist2 = await booking.findStylist("0601002100");

        // Clients makes Pedicure booking
        const makeAbooking = {
            date: "2023-11-30",
            time: "10:45",
            booked: true,
            clientId: client.client_id,
            stylistId: stylist.stylist_id,
            treatmentCode: treatmentCodes.Pedicure,
        };
        const makeAbooking2 = {
            date: "2023-12-09",
            time: "10:30",
            booked: true,
            clientId: client2.client_id,
            stylistId: stylist2.stylist_id,
            treatmentCode: treatmentCodes.MakeUp,
        };

        // Make client booking
        await booking.makeBooking(makeAbooking);
        await booking.makeBooking(makeAbooking2);

        const bookings = await booking.findAllBookings(makeAbooking2.date);

        assert.deepEqual(
            [
                {
                    booking_date: "2023-12-09",
                    booking_time: "10:30:00",
                    client_first_name: "Katlego",
                    client_last_name: "Mokhele",
                    stylist_first_name: "Eric",
                    stylist_last_name: "Timmy",
                    treatment_type: "Make up",
                },
            ],
            bookings
        );
    });

    it("should be able to get bookings for a date", async function () {
        // First check if client exist
        const client = await booking.findClient("Asisipho");
        const client2 = await booking.findClient("Nick");

        const stylist = await booking.findStylist("0786457736");
        const stylist2 = await booking.findStylist("0786457736");

        // Clients makes Pedicure booking
        const makeAbooking = {
            date: "2023-12-31",
            time: "10:00",
            booked: true,
            clientId: client.client_id,
            stylistId: stylist.stylist_id,
            treatmentCode: treatmentCodes.MakeUp,
        };
        const makeAbooking2 = {
            date: "2023-12-15",
            time: "12:30",
            booked: true,
            clientId: client2.client_id,
            stylistId: stylist2.stylist_id,
            treatmentCode: treatmentCodes.BrowsAndLashes,
        };

        // Make client booking
        await booking.makeBooking(makeAbooking);
        await booking.makeBooking(makeAbooking2);

        const checkBooking = {
            date: "2023-12-15",
            time: "12:30",
        };

        const bookings = await booking.findAllBookings__(checkBooking);

        assert.deepEqual(
            [
                {
                    booking_date: "2023-12-15",
                    booking_time: "12:30:00",
                    client_first_name: "Nick",
                    client_last_name: "Truter",
                    stylist_first_name: "Sino",
                    stylist_last_name: "Mguli",
                    treatment_type: "Brows & Lashes",
                    treatment_id: 4
                },
            ],
            bookings
        );

        const checkBooking2 = {
            date: "2023-12-31"
        };

        // Testing for only date
        const bookings2 = await booking.findAllBookings__(checkBooking2);

        assert.equal(1, bookings2.length);
    });

    it("should be able to find stylist booked for treatment", async () => {
        // First check if client exist
        const client = await booking.findClient("Mthunzi");

        const stylist = await booking.findStylist("0786457736");

        // Clients makes Pedicure booking
        const makeAbooking = {
            date: "2023-12-01",
            time: "10:30",
            booked: true,
            clientId: client.client_id,
            stylistId: stylist.stylist_id,
            treatmentCode: treatmentCodes.BrowsAndLashes,
        };

        // Make client booking
        await booking.makeBooking(makeAbooking);

        const bookings = await booking.findClientBookings(makeAbooking);

        assert.deepEqual(1, bookings.length);

        const bookedStylists = await booking.findStylistsForTreatment(treatmentCodes.BrowsAndLashes);
        assert.deepEqual([{ stylist_first_name: 'Sino', stylist_last_name: 'Mguli' }], bookedStylists);
    });

    it("should be able to calculate the total income for a day", async function() {
        // First check if client exist
        const client = await booking.findClient("Mthunzi");

        const stylist = await booking.findStylist("0786457736");

        // Clients makes Pedicure booking
        const makeAbooking = {
            date: "2023-12-04",
            time: "10:30",
            booked: true,
            clientId: client.client_id,
            stylistId: stylist.stylist_id,
            treatmentCode: treatmentCodes.BrowsAndLashes,
        };

        // Make client booking
        await booking.makeBooking(makeAbooking);
        const date = '2023-12-04';
        const bookingsPrice = await booking.totalIncomeForDay(date);
        assert.equal(240, Number(bookingsPrice.booking_price));
    })

    // it("should be able to find the most valuable client", function() {
    //     assert.equal(1, 2);
    // })
    // it("should be able to find the total commission for a given stylist", function() {
    //     assert.equal(1, 2);
    // })

    after(function () {
        db.$pool.end();
    });
});
