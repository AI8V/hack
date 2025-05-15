(async () => {
  try {
    // استدعاء بيانات IP و Location من ipapi.co
    const res = await fetch("https://ipapi.co/json/");
    const ipData = await res.json();

    // تجهيز البيانات للإرسال
    const dataToSend = {
      ip: ipData.ip,
      location: `${ipData.city}, ${ipData.region}, ${ipData.country_name}`,
      device: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop",
      browser: navigator.userAgent
    };

    // إرسال البيانات إلى Google Apps Script
    await fetch("https://script.google.com/macros/s/AKfycbzc7m34sI0f2xNM7NMUOl1g9O2nAJn0Jb8gEWj6GsIhiTPe4nxw9-4nBAm8ghWdlxroMw/exec", {
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