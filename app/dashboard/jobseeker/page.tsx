'use client'

export default function DashboardJobSeeker() {

    async function onSubmitCv(ev:any) {
        ev.preventDefault();

        console.log("subbmit");

        let formData = new FormData();
        formData.append('file', ev.target.uploaderCv.files[0]);

        const resp = await fetch(`http://localhost:8000/upload/cv`, {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();

        if ( resp.status === 200 ) {
            alert("OK")
        } else {
            alert("ERROR")
        }
    }

    return (
        <div>
            <form onSubmit={onSubmitCv}>
                <label htmlFor="uploaderCv">Déposer un CV (PDF) </label>
                <input id="uploaderCv" type="file" name="uploaderCv" accept="application/pdf"></input>
                <button type="submit" className="bg bg-green-400 rounded-xl p-2 text-center">Upload</button>
            </form>

        </div>
    );
}