let tombol = document.getElementById("tambahTugas")
let daftar = document.querySelector(".daftar")

// memuat data dari server ke frontend
window.addEventListener('load', () => {
    fetch('http://localhost:3000/api/task')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            for (let i = 0; i < data.length; i++) {
                const task = data[i]

                const liTugas = document.createElement("li");
                liTugas.textContent = task.task_name;

                const liTanggal = document.createElement("p");
                liTanggal.textContent = "Tanggal " + task.task_date

                const liTask = document.createElement("p");
                liTask.textContent = "Jenis Tugas = " + task.task_type

                daftar.appendChild(liTugas)
                daftar.appendChild(liTanggal)
                daftar.appendChild(liTask)
            }
        })
        .catch(error => console.error('Error fetching data: ', error))
})

// untuk simpan data ke frontend dan db
tombol.addEventListener("click", function () {
    let tugas = document.getElementById("task").value
    let tanggal = document.getElementById("tanggal").value
    let taskList = document.getElementById("taskList").value

    if (tugas.trim() === '') {
        alert("Tugas belum diisi!")
        return
    }

    fetch('http://localhost:3000/api/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_name: tugas,
            task_date: tanggal,
            task_type: taskList
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error: ', error)
            alert('Terjadi kesalahan saat menyimpan data!')
        })

    const liTugas = document.createElement("li");
    liTugas.textContent = tugas;

    const liTanggal = document.createElement("p");
    liTanggal.textContent = "Tanggal " + tanggal

    const liTask = document.createElement("p");
    liTask.textContent = "Jenis Tugas = " + taskList

    daftar.appendChild(liTugas)
    daftar.appendChild(liTanggal)
    daftar.appendChild(liTask)

    document.getElementById("task").value = ''
    document.getElementById("tanggal").value = ''
})
