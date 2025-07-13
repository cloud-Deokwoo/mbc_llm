// firebase-auth-script.js
// Firebase SDK CDN Imports는 HTML 파일에서 모듈로 임포트됩니다.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from "./env.js"
console.log(firebase);
window.__firebase_config = firebase;

let app;
let auth;
let db;
let currentUserId = null;

/**
 * Firebase를 초기화하고 사용자 인증을 처리합니다.
 * Canvas 환경에서 제공되는 전역 변수를 사용합니다.
 */
export function initFirebaseAndAuthenticate() {
    // Canvas 환경에서 제공되는 전역 변수에 접근
    const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    const firebaseConfig = JSON.parse(typeof window.__firebase_config !== 'undefined' ? window.__firebase_config : '{}');
    const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

    // Firebase 설정이 비어있으면 초기화하지 않고 경고 메시지를 출력합니다.
    if (Object.keys(firebaseConfig).length === 0) {
        console.warn("Firebase config is empty. Firebase will not be initialized.");
        return;
    }

    // Firebase 앱이 아직 초기화되지 않았다면 초기화합니다.
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    }

    /**
     * 사용자를 인증합니다. 초기 인증 토큰이 있으면 커스텀 토큰으로 로그인하고,
     * 없으면 익명으로 로그인합니다.
     */
    async function authenticateUser() {
        try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Firebase authentication error:", error);
            // 인증 오류를 사용자 인터페이스에 적절히 표시할 수 있습니다.
        }
    }

    /**
     * 인증 상태 변화를 감지하고 사용자 ID를 UI에 업데이트합니다.
     */
    onAuthStateChanged(auth, (user) => {
        const userIdDisplay = document.getElementById('userIdDisplay');
        if (user) {
            currentUserId = user.uid;
            console.log("User authenticated:", currentUserId);
            if (userIdDisplay) {
                userIdDisplay.textContent = `현재 사용자 ID: ${currentUserId}`;
            }
        } else {
            currentUserId = null;
            console.log("No user is signed in.");
            if (userIdDisplay) {
                userIdDisplay.textContent = '로그인되지 않음';
            }
        }
    });

    // 인증 함수를 호출하여 로그인 프로세스를 시작합니다.
    authenticateUser();
}

// 필요한 경우 다른 스크립트에서 Firebase 인스턴스에 접근할 수 있도록 내보냅니다.
export { auth, db, currentUserId };
