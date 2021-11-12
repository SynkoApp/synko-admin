import axios from "axios";

export default function auth({ next, router }) {
    if(!localStorage.getItem('token')) {
        return router.push({ name: 'Login' });
    } else {
        axios({
            method: "post",
            url: "http://localhost:4060/admin/checkToken",
            headers: {
              Authorization: localStorage.getItem('token')
            }
        }).then(() => {
            return next();
        }).catch(() => {
            localStorage.removeItem('token');
            return router.push({ name: 'Login' })
        });
    }
}