import _ from "lodash";

const SalonBooking = (database) => {

    const findStylist = async (phoneNumber) => {
        return await database.oneOrNone("select * from stylists where phone_number = $1", [phoneNumber]);
    };

    const findClient = async (firstName) => {
        return await database.oneOrNone("select * from clients where client_first_name = $1", [firstName]);
    };

    const findTreatment = async (treatmentCode) => {
        return await database.oneOrNone("select * from treatments where code = $1", [treatmentCode]);
    };

    const findAllTreatments = async () => {
        return await database.manyOrNone("select * from treatments");
    };

    const makeBooking = async (booking) => {
        const bookingData = [
            booking.date,
            booking.time,
            booking.booked,
            booking.clientId,
            booking.stylistId,
            booking.treatmentCode
        ];

        const values = `values ($1, $2, $3, $4, $5, $6)`;
        const query = `insert into bookings (booking_date, booking_time, booked, client_id, stylist_id, treatment_code) ${values}`;

        await database.none(query, bookingData);
    };

    const findAllBookings = (date) => {
        const join1 = `inner join treatments on bookings.treatment_code = treatments.code`;
        const join2 = `inner join clients on bookings.client_id = clients.client_id`;
        const join3 = `inner join stylists on bookings.stylist_id = stylists.stylist_id`;
        const selection = `booking_date::text, booking_time, treatment_type, clients.client_first_name, clients.client_last_name, stylists.stylist_first_name, stylists.stylist_last_name`;
        const query = `select ${selection} from bookings ${join1} ${join2} ${join3} where bookings.booking_date::text = $1`;

        return database.manyOrNone(query, [date]);
    };

    const findClientBookings = (booking) => {
        const bookingData = [
            booking.treatmentCode,
            booking.clientId
        ];
        const join1 = `inner join treatments on bookings.treatment_code = treatments.code`;
        const join2 = `inner join clients on bookings.client_id = clients.client_id`;
        const join3 = `inner join stylists on bookings.stylist_id = stylists.stylist_id`;
        const selection = `booking_date::text, booking_time, treatments.treatment_type, treatments.treatment_id, clients.client_first_name, clients.client_last_name, stylists.stylist_first_name, stylists.stylist_last_name`;
        const query = `select ${selection} from bookings ${join1} ${join2} ${join3} where bookings.treatment_code = $1 and bookings.client_id = $2`;

        return database.manyOrNone(query, bookingData);
    };

    const findStylistsForTreatment = async (treatmentCode) => {
        const join = `inner join bookings on stylists.stylist_id = bookings.stylist_id`;
        return database.manyOrNone(`select stylist_first_name, stylist_last_name from stylists ${join} where treatment_code = $1`, [treatmentCode]);
    };

    const findAllBookings__ = async (booking) => {

        const providedBooking = _.isEmpty(booking);

        if (providedBooking) {
            const join1 = `inner join treatments on bookings.treatment_code = treatments.code`;
            const join2 = `inner join clients on bookings.client_id = clients.client_id`;
            const join3 = `inner join stylists on bookings.stylist_id = stylists.stylist_id`;
            const query = `select * from bookings ${join1} ${join2} ${join3}`;

            return database.manyOrNone(query);
        };

        const bookingData = [
            booking.date,
            booking.time
        ];

        const join1 = `inner join treatments on bookings.treatment_code = treatments.code`;
        const join2 = `inner join clients on bookings.client_id = clients.client_id`;
        const join3 = `inner join stylists on bookings.stylist_id = stylists.stylist_id`;
        const selection = `booking_date::text, booking_time, treatments.treatment_type, treatments.treatment_id, clients.client_first_name, clients.client_last_name, stylists.stylist_first_name, stylists.stylist_last_name`;
        const query = `select ${selection} from bookings ${join1} ${join2} ${join3} where bookings.booking_date = $1 or bookings.booking_time = $2`;

        return database.manyOrNone(query, bookingData);
    };

    const totalIncomeForDay = (date) => {

    };

    const mostValuebleClient = () => {

    };

    const totalCommission = () => {

    };

    return {
        findStylist,
        findClient,
        findTreatment,
        findAllTreatments,
        makeBooking,
        findAllBookings,
        findClientBookings,
        findStylistsForTreatment,
        findAllBookings__,
        totalIncomeForDay,
        mostValuebleClient,
        totalCommission,
    };
};

export default SalonBooking;