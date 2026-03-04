// ฟังก์ชัน Login (ทำงานในหน้า index.html)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (data.success) {
                window.location.href = 'search.html';
            } else {
                alert(data.message); // แจ้งเตือนเมื่อผิดพลาด
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        }
    });
}

// ฟังก์ชันโหลดและค้นหาหนังสือรุ่น (ทำงานในหน้า search.html)
let allYearbooks = [];

async function fetchYearbooks() {
    try {
        const response = await fetch('/api/yearbooks');
        const data = await response.json();
        
        if (data.success) {
            allYearbooks = data.data;
            renderTable(allYearbooks);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>นตท. รุ่นที่ ${item.class_number}</td>
            <td>
                <a href="${item.pdf_url}" target="_blank" class="btn-download">Download</a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ระบบค้นหา (กรองข้อมูลจากตาราง)
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput').value.trim();
        const searchType = document.getElementById('searchType').value;
        
        // ไม่ว่าจะเป็น internet หรือ intranet แสดงผลเหมือนกันตามโจทย์ 
        // กรองข้อมูลตามรุ่นที่พิมพ์ในช่อง
        if (searchInput === '') {
            renderTable(allYearbooks);
        } else {
            const filteredData = allYearbooks.filter(item => 
                item.class_number.toString() === searchInput
            );
            renderTable(filteredData);
        }
    });
}
