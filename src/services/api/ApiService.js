const API_URL = 'http://localhost:5000/api';

class ApiService {

    async getStatus() {
        try {
            const res = await fetch(`${API_URL}/`);
            return await res.text();
        } catch (e) {
            console.error("API Status Check Failed:", e);
            return null;
        }
    }

    async getAllUsers() {
        try {
            const res = await fetch(`${API_URL}/admin/users`);
            if (!res.ok) throw new Error("Failed to fetch users");
            return await res.json();
        } catch (e) {
            console.error("API Get Users Failed:", e);
            throw e;
        }
    }

    async toggleUserBan(uid, shouldBan) {
        try {
            const res = await fetch(`${API_URL}/admin/ban-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, disabled: shouldBan })
            });
            if (!res.ok) throw new Error("Failed to toggle ban");
            return await res.json();
        } catch (e) {
            console.error("API Ban Toggle Failed:", e);
            throw e;
        }
    }

    async getAllBusinesses() {
        try {
            const res = await fetch(`${API_URL}/admin/businesses`);
            if (!res.ok) throw new Error("Failed to fetch businesses");
            return await res.json();
        } catch (e) {
            console.error("API Get Businesses Failed:", e);
            throw e;
        }
    }

    async updateBusinessStatus(businessId, status) {
        try {
            const res = await fetch(`${API_URL}/admin/business-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessId, status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            return await res.json();
        } catch (e) {
            console.error("API Status Update Failed:", e);
            throw e;
        }
    }
}

export default ApiService;
