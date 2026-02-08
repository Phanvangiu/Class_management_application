import axios from "axios";

export async function sendOtp(phone: string, otp: string) {
  const token = process.env.SPEEDSMS_TOKEN;

  let formattedPhone = phone.trim();

  if (formattedPhone.startsWith("+84")) {
    formattedPhone = "0" + formattedPhone.substring(3);
  } else if (
    formattedPhone.startsWith("84") &&
    !formattedPhone.startsWith("0")
  ) {
    formattedPhone = "0" + formattedPhone.substring(2);
  }

  formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, "");

  const auth = Buffer.from(`${token}:x`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.speedsms.vn/index.php/sms/send",
      {
        to: [formattedPhone],
        content: `Ma OTP cua ban la ${otp}. Ma co hieu luc trong 5 phut.`,
        sms_type: 4,
        sender: "Verify",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        timeout: 10000,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to send OTP via SpeedSMS",
    );
  }
}

export async function checkBalance() {
  const token = process.env.SPEEDSMS_TOKEN;
  const auth = Buffer.from(`${token}:x`).toString("base64");

  try {
    const response = await axios.get(
      "https://api.speedsms.vn/index.php/user/info",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 5000,
      },
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function sendOtpViaVoice(phone: string, otp: string) {
  const token = process.env.SPEEDSMS_TOKEN;

  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("+84")) {
    formattedPhone = "0" + formattedPhone.substring(3);
  } else if (
    formattedPhone.startsWith("84") &&
    !formattedPhone.startsWith("0")
  ) {
    formattedPhone = "0" + formattedPhone.substring(2);
  }
  formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, "");

  const auth = Buffer.from(`${token}:x`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.speedsms.vn/index.php/voice/otp",
      {
        to: formattedPhone,
        content: otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        timeout: 10000,
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to send Voice OTP",
    );
  }
}
