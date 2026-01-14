// handles OTP database operations using raw SQL

const pool = require("../config/db");

// generate 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// create OTP (delete old OTP of same type first)
const createOtp = async ({ userId, email, type }) => {
  const client = await pool.connect();

  try {
    const otp = generateOtp();

    // delete existing OTPs of same type for this user
    await client.query(
      `DELETE FROM otps WHERE user_id = $1 AND type = $2`,
      [userId, type]
    );

    // expiry: 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await client.query(
      `
      INSERT INTO otps (user_id, email, otp, type, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [userId, email, otp, type, expiresAt]
    );

    return otp;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// verify OTP
const verifyOtp = async ({ userId, otp, type }) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT * FROM otps
      WHERE user_id = $1 AND otp = $2 AND type = $3
      `,
      [userId, otp, type]
    );

    if (result.rowCount === 0) {
      throw new Error("Invalid OTP");
    }

    const otpRecord = result.rows[0];

    // check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      throw new Error("OTP expired");
    }

    // delete OTP after successful verification
    await client.query(
      `DELETE FROM otps WHERE id = $1`,
      [otpRecord.id]
    );

    return true;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createOtp,
  verifyOtp,
};