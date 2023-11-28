import { Router } from "express";
import database from "../model/connectDb.js";
import SalonBooking from "../services/salon-booking.js";

// lodash import
import _ from "lodash";

const router = Router();
const salonService = SalonBooking(database);

// Create a route to show all available bookings
router.get("/", async (req, res) => {
    const availableTreatment = await salonService.findAllTreatments();

    res.render("index", {
        treatments: availableTreatment
    });
});

// Create a route to make a booking
router.post("/book/treatment/", async (req, res) => {
    const { treatmentCode, date, time, stylistNumber, clientName } = req.body;

    const stylist = await salonService.findStylist(stylistNumber);
    const client = await salonService.findClient(clientName);

    if (stylist && client) {
        const booking = {
            treatmentCode: treatmentCode,
            date: date,
            time: time,
            stylistId: stylist.stylist_id,
            clientId: client.client_id,
        };
    
        const isBooked = _.every(booking, Boolean);
    
        if(isBooked) {
            booking.booked = true;
            // Make booking
            await salonService.makeBooking(booking);
    
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


// Create a route to display all bookings
router.get("/bookings/all", async (req, res) => {
    const bookings = await salonService.findAllBookings__();
    res.render("bookings", {
        madeBookings: bookings
    });
});


// Create a route to search for a booking
router.post("/bookings/searchBooking/", async (req, res) => {
    const { date, time } = req.body;
    const booking = {
        date: date,
        time: time
    };

    if (booking.date && booking.time) {
        const foundBookings = await salonService.findAllBookings__(booking);
        
        req.flash("success", "Found a booking.");

        res.render("bookings", {
            madeBookings: foundBookings
        });

    } else if (booking.date) {
        const foundBookings = await salonService.findAllBookings__({
            date: date
        });
        
        req.flash("success", "Found a booking.");

        res.render("bookings", {
            madeBookings: foundBookings
        });
    } else if (booking.time) {
        const foundBookings = await salonService.findAllBookings__({
            time: time
        });
        
        req.flash("success", "Found a booking.");

        res.render("bookings", {
            madeBookings: foundBookings
        });
    }
    
    else {
        req.flash("error", "Select date or time.");
        res.redirect("/bookings/all");
        return;
    };
});

// Create a route for displaying the total price of bookings made for a selected day
router.get("/bookings/price", async (req, res) => {
    res.render("bookingsPrice");
});

router.post("/bookings/price", async (req, res) => {
    const { date } = req.body;

    if (date) {
        const bookingsPrice = await salonService.totalIncomeForDay(date);
    
        res.render("bookingsPrice", {
            bookingsPrice: bookingsPrice.booking_price,
        });

    } else {
        req.flash("error", "Select date or time.");
        res.redirect("/bookings/price");
        return;
    };
    
})


export default router;