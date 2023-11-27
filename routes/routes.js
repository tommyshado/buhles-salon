import { Router } from "express";
import database from "../model/connectDb.js";
import SalonBooking from "../services/salon-booking.js";

// lodash import
import _ from "lodash";

const router = Router();
const salonService = SalonBooking(database);

router.get("/", async (req, res) => {
    const availableTreatment = await salonService.findAllTreatments();

    res.render("index", {
        treatments: availableTreatment
    });
});

router.post("/book/treatment/stylistId/:stylistId/clientId/:clientId", async (req, res) => {
    const { treatmentCode, date, time } = req.body;
    const { stylistId, clientId } = req.params;

    const booking = {
        treatmentCode: treatmentCode,
        date: date,
        time: time,
        stylistId: stylistId,
        clientId: clientId,
    };

    const isBooked = _.every(booking, Boolean);

    if(isBooked) {
        booking.booked = true;
        // Make booking
        salonService.makeBooking(booking);

        req.flash("success", "Treatment booked successfully.");
        res.redirect("/");

    } else {
        req.flash("error", "Treatment not booked successfully.");
        res.redirect("/");
    };
});

export default router;