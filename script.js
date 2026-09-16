/* =====================================================
   SMARTPARK
   SMART PARKING MANAGEMENT SYSTEM
===================================================== */


/* =====================================================
   PARKING DATA
===================================================== */

const totalParkingSlots = 12;


/*
    Load parking data from localStorage.

    If no saved data exists,
    create default parking slots.
*/

let parkingSlots =
    JSON.parse(
        localStorage.getItem(
            "smartpark_slots"
        )
    ) || [

        {
            id: 1,
            occupied: false
        },

        {
            id: 2,
            occupied: true
        },

        {
            id: 3,
            occupied: false
        },

        {
            id: 4,
            occupied: false
        },

        {
            id: 5,
            occupied: true
        },

        {
            id: 6,
            occupied: false
        },

        {
            id: 7,
            occupied: false
        },

        {
            id: 8,
            occupied: true
        },

        {
            id: 9,
            occupied: false
        },

        {
            id: 10,
            occupied: false
        },

        {
            id: 11,
            occupied: true
        },

        {
            id: 12,
            occupied: false
        }

    ];


/* =====================================================
   VARIABLES
===================================================== */

let selectedSlot = null;

let bookings =
    JSON.parse(
        localStorage.getItem(
            "smartpark_bookings"
        )
    ) || [];


let qrScanner = null;

let currentBooking = null;


/* =====================================================
   HTML ELEMENTS
===================================================== */

const parkingGrid =
    document.getElementById(
        "parkingGrid"
    );


const availableSlots =
    document.getElementById(
        "availableSlots"
    );


const occupiedSlots =
    document.getElementById(
        "occupiedSlots"
    );


const totalBookings =
    document.getElementById(
        "totalBookings"
    );


const selectedSlotText =
    document.getElementById(
        "selectedSlot"
    );


const parkingPrice =
    document.getElementById(
        "parkingPrice"
    );


const bookingForm =
    document.getElementById(
        "bookingForm"
    );


const historyBody =
    document.getElementById(
        "historyBody"
    );


const vehicleType =
    document.getElementById(
        "vehicleType"
    );


const paymentAmount =
    document.getElementById(
        "paymentAmount"
    );


const paymentStatus =
    document.getElementById(
        "paymentStatus"
    );


const bookingQRCode =
    document.getElementById(
        "bookingQRCode"
    );


const qrBookingText =
    document.getElementById(
        "qrBookingText"
    );


const scanResult =
    document.getElementById(
        "scanResult"
    );


const locationStatus =
    document.getElementById(
        "locationStatus"
    );


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "smartpark_slots",
        JSON.stringify(
            parkingSlots
        )
    );


    localStorage.setItem(
        "smartpark_bookings",
        JSON.stringify(
            bookings
        )
    );

}


/* =====================================================
   DISPLAY PARKING SLOTS
===================================================== */

function displayParkingSlots() {

    parkingGrid.innerHTML = "";


    parkingSlots.forEach(
        function(slot) {


            const slotElement =
                document.createElement(
                    "div"
                );


            slotElement.classList.add(
                "slot"
            );


            /*
                OCCUPIED SLOT
            */

            if (slot.occupied) {

                slotElement.classList.add(
                    "occupied"
                );


                slotElement.innerHTML = `

                    <div class="slot-number">
                        P${slot.id}
                    </div>

                    <div class="slot-status">
                        🔴 Occupied
                    </div>

                `;

            }


            /*
                AVAILABLE SLOT
            */

            else {

                slotElement.innerHTML = `

                    <div class="slot-number">
                        P${slot.id}
                    </div>

                    <div class="slot-status">
                        🟢 Available
                    </div>

                `;


                slotElement.addEventListener(
                    "click",
                    function() {

                        selectParkingSlot(
                            slot.id
                        );

                    }
                );

            }


            parkingGrid.appendChild(
                slotElement
            );

        }
    );


    updateDashboard();

}


/* =====================================================
   SELECT PARKING SLOT
===================================================== */

function selectParkingSlot(
    slotId
) {

    const slot =
        parkingSlots.find(
            function(item) {

                return item.id === slotId;

            }
        );


    /*
        Prevent occupied slot
    */

    if (
        !slot ||
        slot.occupied
    ) {

        alert(
            "This parking slot is occupied."
        );

        return;

    }


    selectedSlot =
        slotId;


    selectedSlotText.textContent =
        "Parking Slot P" +
        slotId;


    /*
        Remove previous selected class
    */

    document
        .querySelectorAll(
            ".slot"
        )
        .forEach(
            function(element) {

                element.classList.remove(
                    "selected"
                );

            }
        );


    /*
        Find selected slot
    */

    document
        .querySelectorAll(
            ".slot"
        )
        .forEach(
            function(element) {

                const number =
                    element.querySelector(
                        ".slot-number"
                    );


                if (
                    number &&
                    number.textContent.trim()
                        === "P" + slotId
                ) {

                    element.classList.add(
                        "selected"
                    );

                }

            }
        );


    /*
        Scroll to booking
    */

    document
        .getElementById(
            "booking"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {


    const available =
        parkingSlots.filter(
            function(slot) {

                return !slot.occupied;

            }
        ).length;


    const occupied =
        parkingSlots.filter(
            function(slot) {

                return slot.occupied;

            }
        ).length;


    availableSlots.textContent =
        available;


    occupiedSlots.textContent =
        occupied;


    totalBookings.textContent =
        bookings.length;

}


/* =====================================================
   PRICE CALCULATION
===================================================== */

function calculatePrice() {


    const type =
        vehicleType.value;


    let price = 0;


    if (type === "Bike") {

        price = 20;

    }

    else if (type === "Car") {

        price = 40;

    }

    else if (type === "SUV") {

        price = 60;

    }


    parkingPrice.textContent =
        price;


    paymentAmount.textContent =
        price;


    return price;

}


/* =====================================================
   VEHICLE TYPE CHANGE
===================================================== */

vehicleType.addEventListener(
    "change",
    function() {

        calculatePrice();

    }
);


/* =====================================================
   BOOKING FORM
===================================================== */

bookingForm.addEventListener(
    "submit",
    function(event) {


        event.preventDefault();


        /*
            CHECK SLOT
        */

        if (
            selectedSlot === null
        ) {

            alert(
                "Please select an available parking slot first."
            );

            return;

        }


        /*
            GET VEHICLE NUMBER
        */

        const vehicleNumber =
            document
                .getElementById(
                    "vehicleNumber"
                )
                .value
                .trim()
                .toUpperCase();


        /*
            GET VEHICLE TYPE
        */

        const type =
            vehicleType.value;


        /*
            GET DATE
        */

        const date =
            document
                .getElementById(
                    "bookingDate"
                )
                .value;


        /*
            GET TIME
        */

        const time =
            document
                .getElementById(
                    "bookingTime"
                )
                .value;


        /*
            VALIDATION
        */

        if (
            vehicleNumber === "" ||
            type === "" ||
            date === "" ||
            time === ""
        ) {

            alert(
                "Please fill all the details."
            );

            return;

        }


        /*
            VEHICLE NUMBER VALIDATION
        */

        const vehiclePattern =
            /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{3,4}$/;


        if (
            !vehiclePattern.test(
                vehicleNumber
            )
        ) {

            alert(
                "Please enter a valid vehicle number.\nExample: GJ01AB1234"
            );

            return;

        }


        /*
            CALCULATE PRICE
        */

        const price =
            calculatePrice();


        if (price === 0) {

            alert(
                "Please select vehicle type."
            );

            return;

        }


        /*
            CHECK SLOT AGAIN
        */

        const slot =
            parkingSlots.find(
                function(item) {

                    return item.id ===
                        selectedSlot;

                }
            );


        if (
            !slot ||
            slot.occupied
        ) {

            alert(
                "Sorry! This slot is no longer available."
            );

            displayParkingSlots();

            return;

        }


        /*
            CREATE BOOKING ID
        */

        const bookingId =
            "SP" +
            Date.now();


        /*
            CREATE BOOKING
        */

        const booking = {

            id:
                bookingId,

            vehicle:
                vehicleNumber,

            type:
                type,

            slot:
                "P" +
                selectedSlot,

            date:
                date,

            time:
                time,

            price:
                price,

            status:
                "Pending Payment",

            createdAt:
                new Date()
                    .toISOString()

        };


        /*
            SAVE BOOKING
        */

        bookings.push(
            booking
        );


        /*
            OCCUPY SLOT
        */

        slot.occupied =
            true;


        /*
            SAVE
        */

        saveData();


        /*
            CURRENT BOOKING
        */

        currentBooking =
            booking;


        /*
            GENERATE QR
        */

        generateBookingQR(
            booking
        );


        /*
            UPDATE PAYMENT
        */

        paymentAmount.textContent =
            price;


        paymentStatus.textContent =
            "⚠️ Payment pending";


        /*
            SUCCESS MESSAGE
        */

        alert(

            "Parking booked successfully!\n\n" +

            "Booking ID: " +
            bookingId +

            "\nVehicle: " +
            vehicleNumber +

            "\nSlot: P" +
            selectedSlot +

            "\nFee: ₹" +
            price +

            "\n\nPlease complete payment."

        );


        /*
            RESET SELECTION
        */

        selectedSlot =
            null;


        selectedSlotText.textContent =
            "No slot selected";


        bookingForm.reset();


        parkingPrice.textContent =
            "0";


        /*
            UPDATE SCREEN
        */

        displayParkingSlots();

        displayHistory();


        /*
            Scroll to payment
        */

        setTimeout(
            function() {

                document
                    .getElementById(
                        "payment"
                    )
                    .scrollIntoView({
                        behavior:
                            "smooth"
                    });

            },
            500
        );

    }
);


/* =====================================================
   BOOKING HISTORY
===================================================== */

function displayHistory() {


    historyBody.innerHTML = "";


    if (
        bookings.length === 0
    ) {

        historyBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No bookings yet.

                </td>

            </tr>

        `;

        return;

    }


    bookings
        .slice()
        .reverse()
        .forEach(
            function(booking) {


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${booking.vehicle}
                    </td>

                    <td>
                        ${booking.type}
                    </td>

                    <td>
                        <strong>
                            ${booking.slot}
                        </strong>
                    </td>

                    <td>
                        ${booking.date}
                    </td>

                    <td>
                        ${booking.time}
                    </td>

                    <td>
                        ₹${booking.price}
                    </td>

                    <td>
                        ${booking.status}
                    </td>

                `;


                historyBody.appendChild(
                    row
                );

            }
        );

}


/* =====================================================
   GOOGLE MAPS
===================================================== */

function openLocation(
    place
) {


    const googleMapsURL =

        "https://www.google.com/maps/search/?api=1&query=" +

        encodeURIComponent(
            place
        );


    window.open(
        googleMapsURL,
        "_blank"
    );

}


/* =====================================================
   CURRENT LOCATION
===================================================== */

function getCurrentLocation() {


    if (
        !navigator.geolocation
    ) {

        locationStatus.textContent =
            "❌ Geolocation is not supported by your browser.";

        return;

    }


    locationStatus.textContent =
        "📍 Detecting your location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {


            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            locationStatus.textContent =

                "✅ Location detected: " +

                latitude.toFixed(5) +

                ", " +

                longitude.toFixed(5);


            const mapsURL =

                "https://www.google.com/maps/search/?api=1&query=" +

                latitude +

                "," +

                longitude;


            setTimeout(
                function() {

                    window.open(
                        mapsURL,
                        "_blank"
                    );

                },
                500
            );

        },


        function(error) {


            let message =
                "❌ Unable to get location.";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "❌ Location permission denied. Please allow location access.";

            }


            locationStatus.textContent =
                message;

        },

        {

            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                0

        }

    );

}


/* =====================================================
   PHONEPE / UPI PAYMENT
===================================================== */

function startPhonePePayment() {


    const amount =
        paymentAmount.textContent;


    /*
        CHECK AMOUNT
    */

    if (
        amount === "0" ||
        amount === ""
    ) {

        alert(

            "Please select vehicle type and complete a parking booking first."

        );

        return;

    }


    /*
        CHECK CURRENT BOOKING
    */

    if (
        !currentBooking
    ) {

        /*
            Try to find latest booking
        */

        if (
            bookings.length > 0
        ) {

            currentBooking =
                bookings[
                    bookings.length - 1
                ];

        }

        else {

            alert(
                "Please make a parking booking first."
            );

            return;

        }

    }


    paymentStatus.textContent =
        "⏳ Creating UPI payment request...";


    /*
        DEMO UPI DETAILS

        IMPORTANT:

        Replace this demo UPI ID
        with your authorized merchant
        UPI ID only when you have
        proper payment setup.
    */

    const merchantUPI =
        "yourmerchant@upi";


    const merchantName =
        "SmartPark";


    const transactionNote =
        "SmartPark Parking " +
        currentBooking.slot;


    /*
        CREATE UPI LINK
    */

    const upiURL =

        "upi://pay?" +

        "pa=" +
        encodeURIComponent(
            merchantUPI
        ) +

        "&pn=" +
        encodeURIComponent(
            merchantName
        ) +

        "&am=" +
        encodeURIComponent(
            amount
        ) +

        "&tn=" +
        encodeURIComponent(
            transactionNote
        ) +

        "&cu=INR";


    /*
        UPDATE STATUS
    */

    paymentStatus.textContent =
        "📱 Opening UPI / PhonePe...";


    /*
        OPEN PAYMENT APP

        On Android phone,
        compatible UPI apps can
        handle the UPI deep link.
    */

    window.location.href =
        upiURL;


    /*
        Demo status.

        IMPORTANT:
        This does NOT verify a real
        payment.
    */

    setTimeout(
        function() {

            paymentStatus.textContent =
                "ℹ️ Payment opened. Verify payment through your real payment gateway.";

        },
        3000
    );

}


/* =====================================================
   QR SCANNER
===================================================== */

function startQRScanner() {


    /*
        CHECK LIBRARY
    */

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        scanResult.textContent =
            "❌ QR scanner library could not load. Check your internet connection.";

        return;

    }


    /*
        PREVENT DOUBLE SCANNER
    */

    if (
        qrScanner !== null
    ) {

        scanResult.textContent =
            "⚠️ Scanner is already running.";

        return;

    }


    scanResult.textContent =
        "📷 Starting camera...";


    /*
        CREATE SCANNER
    */

    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );


    /*
        START CAMERA
    */

    qrScanner.start(

        {
            facingMode:
                "environment"
        },

        {
            fps:
                10,

            qrbox:
                {
                    width: 250,
                    height: 250
                }

        },


        function(decodedText) {


            /*
                QR FOUND
            */

            scanResult.textContent =
                "✅ QR Scanned Successfully!";


            /*
                CHECK IF IT IS
                SMARTPARK BOOKING QR
            */

            if (
                decodedText.includes(
                    "SMARTPARK"
                )
            ) {

                alert(
                    "SmartPark QR detected!\n\n" +
                    decodedText
                );

            }


            /*
                IF QR IS A WEBSITE
            */

            else if (
                decodedText
                    .startsWith(
                        "http://"
                    ) ||

                decodedText
                    .startsWith(
                        "https://"
                    )
            ) {

                window.open(
                    decodedText,
                    "_blank"
                );

            }


            /*
                STOP CAMERA
            */

            stopQRScanner();

        },


        function(errorMessage) {

            /*
                Scanner continues.
                No error message shown.
            */

        }

    )

    .catch(
        function(error) {

            scanResult.textContent =
                "❌ Camera could not start. Please allow camera permission.";

            qrScanner =
                null;

        }
    );

}


/* =====================================================
   STOP QR SCANNER
===================================================== */

function stopQRScanner() {


    if (
        qrScanner === null
    ) {

        return;

    }


    qrScanner
        .stop()
        .then(
            function() {

                qrScanner.clear();

                qrScanner =
                    null;

            }
        )
        .catch(
            function() {

                qrScanner =
                    null;

            }
        );

}


/* =====================================================
   GENERATE BOOKING QR
===================================================== */

function generateBookingQR(
    booking
) {


    /*
        CLEAR OLD QR
    */

    bookingQRCode.innerHTML =
        "";


    /*
        CREATE QR DATA
    */

    const bookingData =

        "SMARTPARK\n" +

        "Booking ID: " +
        booking.id +

        "\nVehicle: " +
        booking.vehicle +

        "\nType: " +
        booking.type +

        "\nSlot: " +
        booking.slot +

        "\nDate: " +
        booking.date +

        "\nTime: " +
        booking.time +

        "\nFee: ₹" +
        booking.price;


    /*
        CREATE QR
    */

    new QRCode(

        bookingQRCode,

        {

            text:
                bookingData,

            width:
                200,

            height:
                200,

            correctLevel:
                QRCode
                    .CorrectLevel
                    .H

        }

    );


    /*
        UPDATE TEXT
    */

    qrBookingText.textContent =

        "🎫 " +

        booking.slot +

        " • " +

        booking.vehicle;

}


/* =====================================================
   DOWNLOAD BOOKING QR
===================================================== */

function downloadBookingQR() {


    const qrImage =
        bookingQRCode
            .querySelector(
                "img"
            );


    /*
        CHECK QR
    */

    if (!qrImage) {

        alert(
            "Please complete a booking first."
        );

        return;

    }


    /*
        CREATE DOWNLOAD LINK
    */

    const link =
        document.createElement(
            "a"
        );


    link.href =
        qrImage.src;


    link.download =
        "SmartPark-Booking-QR.png";


    link.click();

}


/* =====================================================
   DATE SETUP
===================================================== */

const dateInput =
    document.getElementById(
        "bookingDate"
    );


const today =
    new Date()
        .toISOString()
        .split("T")[0];


dateInput.min =
    today;


/*
    Default date
*/

dateInput.value =
    today;


/* =====================================================
   TIME SETUP
===================================================== */

const timeInput =
    document.getElementById(
        "bookingTime"
    );


const now =
    new Date();


let hours =
    String(
        now.getHours()
    ).padStart(
        2,
        "0"
    );


let minutes =
    String(
        now.getMinutes()
    ).padStart(
        2,
        "0"
    );


timeInput.value =
    hours +
    ":" +
    minutes;


/* =====================================================
   RESTORE LATEST BOOKING
===================================================== */

function restoreLatestBooking() {


    if (
        bookings.length === 0
    ) {

        return;

    }


    currentBooking =
        bookings[
            bookings.length - 1
        ];


    /*
        Restore QR
    */

    generateBookingQR(
        currentBooking
    );


    /*
        Restore payment amount
    */

    paymentAmount.textContent =
        currentBooking.price;


    /*
        Restore payment status
    */

    if (
        currentBooking.status
            ===
            "Paid"
    ) {

        paymentStatus.textContent =
            "✅ Payment completed";

    }

    else {

        paymentStatus.textContent =
            "⚠️ Payment pending";

    }

}


/* =====================================================
   RESET ALL DEMO DATA
===================================================== */

function resetSmartParkData() {


    const confirmReset =
        confirm(

            "Are you sure you want to reset all SmartPark demo data?"

        );


    if (!confirmReset) {

        return;

    }


    localStorage.removeItem(
        "smartpark_slots"
    );


    localStorage.removeItem(
        "smartpark_bookings"
    );


    location.reload();

}


/* =====================================================
   INITIALIZE
===================================================== */

displayParkingSlots();


displayHistory();


calculatePrice();


restoreLatestBooking();


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "SmartPark - Smart Parking Solution"
);


console.log(
    "Smart Parking System initialized successfully."
);
