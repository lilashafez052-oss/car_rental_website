$(document).ready(function () {
    //اسماء السيارات واسعار التأجير اليومية بالليرة السورية

        var carNames = {
        "CR-001": "Toyota Corolla",
        "CR-002": "Kia Sportage",
        "CR-003": "Hyundai Elantra",
        "CR-004": "Chevrolet Spark",
        "CR-005": "Nissan Sunny",
        "CR-006": "Porsche 911",
        "CR-007": "Mercedes-Benz C-Class"
    };

    var prices = {
        "CR-001": 250000,
        "CR-002": 400000,
        "CR-003": 300000,
        "CR-004": 180000,
        "CR-005": 250000,
        "CR-006": 2500000,
        "CR-007": 1800000
    };

    // إظهار وإخفاء تفاصيل السيارات في  Cars.html
    $(".details-check").on("change", function () {
        var detailsId = $(this).val();
        $("#" + detailsId).toggle(this.checked);
    });

    // زر الحجز
    var selectedCarsForBooking = [];

$("#bookSelectedCars").on("click", function () {
    var selectedCars = [];

    $("input[name='car']:checked").each(function () {
        selectedCars.push(this.value);
    });

    if (selectedCars.length === 0) {
        alert("يرجى اختيار سيارة واحدة على الأقل.");
        return;
    }

    selectedCarsForBooking = selectedCars;

    $("#bookingFormContainer").show();
    $("#bookingFormContainer")[0].scrollIntoView();
});

    
 // التحقق من صحة التاريخ بصيغة 
 function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    var parts = value.split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);

    var date = new Date(Date.UTC(year,month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month -1 ||
        date.getUTCDate() !== day   ) { 
            return null;
        }
        return date;
    }


    
    
   // حساب تكلفة الحجز والتحقق من البيانات 

    $("#bookingForm").on("submit" , function (event) {
        event.preventDefault();

        var fullName = $("#fullName").val().trim();
        var  nationalId = $("#nationalId").val().trim();
        var email = $("#email").val().trim();
        var phone = $ ("#phone").val().trim();
        var startDateText = $("#startDate").val().trim();
        var endDateText = $("#endDate").val().trim();
        
        // التحقق من الحقول الإلزامية
        if (
        nationalId === "" ||
        startDateText === "" ||
        endDateText === ""
    ) {
        alert("الرقم الوطني وتاريخا البداية والنهاية إلزامية.");
        return;
    }

         // التحقق من الاسم لم يكن فارغ
         if(
            fullName !== "" &&!/^[\u0621-\u064A\s]+$/.test(fullName)) {
         alert("يرجى إدخال الاسم باللغة العربية بالكامل.");
           return;
          }

         // التحقق من الرقم الوطني 
         if(!/^(0[1-9]|1[0-4])[0-9]{9}$/.test(nationalId)) {
            alert("يجب ان يتكون الرقم الوطني من 11 رقماً وأن تكون اول خانتين بين 01و 14");
            return;
        }

         // التحقق من البريد إذ أُدخل
         if(
            email !== "" &&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("يرجى إدخال بريد إلأكتروني صحيح");
            return;
         }

         // التحقق من رقم الموبايل السوري (Syriatel أو MTN)
          if (
          phone !== "" &&
           !/^(09[348596][0-9]{7}|\+963(93|98|99|94|95|96)[0-9]{7})$/.test(phone)
            ) {
           alert("يرجى إدخال رقم موبايل سوري صحيح تابع لسيريتل أو MTN");
            return;
             }



         // التحقق من تواريخ التأجير
         var start= parseDate(startDateText);
         var end = parseDate(endDateText);

         if (start === null || end === null) {
            alert("يرجى إدخال التاريخين بصيغة yyyy-mm-dd");
            return;
         }
         if (end.getTime() <= start.getTime()) {
            alert("يجب ان يكون تاريخ نهاية التأجير بعد تاريخ البداية");
            return;
         }

         // تحديث قائمة السيارات المختارة عند إرسال النموذج
            selectedCarsForBooking = []; 

            $("input[name='car']:checked").each(function () {
             selectedCarsForBooking.push(this.value);
             });

// التأكد من وجود سيارات مختارة
if (selectedCarsForBooking.length === 0) {
    alert("يرجى اختيار سيارة واحدة على الأقل.");
    return;
} 

    // حساب عدد أيام التأجير
    var days = (end.getTime() - start.getTime()) / 86400000;
    var total = 0;
    var message = "ملخص الحجز\n\n";

    // حساب تكلفة كل سيارة
    for (var i = 0; i < selectedCarsForBooking.length; i++) {
        var code = selectedCarsForBooking[i];

        if (
            !Object.prototype.hasOwnProperty.call(prices, code) ||
            !Object.prototype.hasOwnProperty.call(carNames, code)
        ) {
            alert("يوجد رمز سيارة غير صالح.");
            return;
        }

        var cost = prices[code] * days;
        total += cost;

        message += "السيارة: " + carNames[code] + "\n";
        message += "عدد أيام التأجير: " + days + "\n";
        message += "تكلفة السيارة: " +
            cost.toLocaleString() + " ل.س\n\n";
    }

    // خصم 10% إذا تجاوزت المدة 7 أيام
    var discount = days > 7 ? total * 0.10 : 0;
    var finalCost = total - discount;

    message += "الإجمالي قبل الخصم: " +
        total.toLocaleString() + " ل.س\n";

    message += "الخصم: " +
        discount.toLocaleString() + " ل.س\n";

    message += "الإجمالي النهائي: " +
        finalCost.toLocaleString() + " ل.س";

    // إظهار النتيجة داخل الصفحة وفي نافذة
    $("#bookingResult").text(message);
    alert(message);
});
});