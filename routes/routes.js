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

router.post("/book/treatment/", async (req, res) => {
    const { treatmentCode, date, time, stylistNumber, clientName } = req.body;

    const stylist = await salonService.findStylist(stylistNumber);
    const client = await salonService.findClient(clientName);


    console.log(typeof time);


    if (stylist && client) {
        const booking = {
            treatmentCode: treatmentCode,
            date: date,
            time: time,
            stylistId: stylist.stylist_id,
            clientId: client.client_id,
        };

        console.log(booking);
    
        const isBooked = _.every(booking, Boolean);
    
        if(isBooked) {
            booking.booked = true;
            // Make booking
            salonService.makeBooking(booking);
    
            req.flash("success", "Treatment booked successfully.");
            res.redirect("/");
    
        } else {
            req.flash("error", "Treatment not booked successfully. Book again.");
            res.redirect("/");
        };

    } else {
        req.flash("error", "Please fill the details.");
        res.redirect("/");
    };
});

export default router;