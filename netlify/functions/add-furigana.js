// File: netlify/functions/add-furigana.js (ĐÃ SỬA LỖI)

const Kuroshiro = require('kuroshiro').default; // <--- SỬA LỖI Ở ĐÂY

const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

// Khởi tạo Kuroshiro một lần để tái sử dụng, giúp tăng tốc độ
const kuroshiro = new Kuroshiro();
const analyzer = new KuromojiAnalyzer();
let isInitialized = false;

const initialize = async () => {
    if (!isInitialized) {
        await kuroshiro.init(analyzer);
        isInitialized = true;
    }
};

// Hàm chính mà Netlify sẽ chạy
exports.handler = async (event) => {
    try {
        await initialize();

        const { text } = JSON.parse(event.body);

        if (!text) {
            return {
                statusCode: 400,
                body: 'Vui lòng cung cấp văn bản.',
            };
        }

        const result = await kuroshiro.convert(text, { to: 'hiragana', mode: 'furigana' });

        return {
            statusCode: 200,
            body: result,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Lỗi khi xử lý trên server: ' + error.message,
        };
    }
};
