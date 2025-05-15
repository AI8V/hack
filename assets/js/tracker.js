(async () => {
  try {
    // استدعاء بيانات IP و Location من ipapi.co
    const res = await fetch("https://ipwho.is/");
    const ipData = await res.json();

    // تجهيز البيانات للإرسال
    const dataToSend = {
      ip: ipData.ip,
      location: `${ipData.city}, ${ipData.region}, ${ipData.country_name}`,
      device: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop",
      browser: navigator.userAgent
    };

    // إرسال البيانات إلى Google Apps Script
    await fetch("https://script.google.com/macros/s/AKfycbyUaThOm163cXvftrUUIbxtv6AsYRLUgq5MVbDTuZw4W8fEnrRTsXKX4vnXloYtgkr_YQ/exec", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("تم تسجيل البيانات بنجاح");

  } catch (error) {
    console.error("حصل خطأ أثناء تتبع البيانات:", error);
  }
})();
