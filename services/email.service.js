"use strict";

const { UnauthorizedError, BadRequestError, NotFoundError } = require("../utils/app_error");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const sendEmail = require("../utils/email");
const { templateEmailDefault, templateCreateOrder } = require("../configs/templates.email");
const { convertDateTime } = require("../utils/convertTime");
const { convertMoney } = require("../utils/convertMoney");

class EmailService {
  static sendOTPResetPassword = async ({ email, otp }) => {
    let templateHTML = templateEmailDefault.replace("{{title}}", "Mã OTP khôi phục mật khẩu Unicorn");
    templateHTML = templateHTML.replace("{{name}}", "bạn");
    templateHTML = templateHTML.replace("{{home_page}}", "http://localhost:3005");
    templateHTML = templateHTML.replace(
      "{{body}}",
      `Mã OTP khôi phục mật khẩu Unicorn của bạn là: ${otp}. Mã này chỉ có thời hạn trong 10 phút kể từ khi được gửi`
    );

    const sendOTP = await sendEmail({
      email: email,
      subject: "Mã OTP khôi phục mật khẩu UniCorn",
      message: templateHTML,
    });

    return sendOTP;
  };
  static sendEmailOrderDeliveringStatus = async ({ email, orderId }) => {
    let templateHTML = templateEmailDefault.replace("{{title}}", `Đơn hàng ${orderId} đang được vận chuyển`);
    templateHTML = templateHTML.replace("{{name}}", "bạn");
    templateHTML = templateHTML.replace("{{home_page}}", "http://localhost:3005");
    templateHTML = templateHTML.replace(
      "{{body}}",
      `Đơn hàng ${orderId} đã được xác nhận và đang được vận chuyển đến tay bạn. Hãy chờ nhận hàng từ shipper nhé!`
    );

    const sendOTP = await sendEmail({
      email: email,
      subject: `Đơn hàng ${orderId} đang được vận chuyển`,
      message: templateHTML,
    });

    return sendOTP;
  };
  static sendEmailOrderDeliveredStatus = async ({ email, orderId }) => {
    let templateHTML = templateEmailDefault.replace("{{title}}", `Đơn hàng ${orderId} đã giao thành công`);
    templateHTML = templateHTML.replace("{{name}}", "bạn");
    templateHTML = templateHTML.replace("{{home_page}}", "http://localhost:3005");
    templateHTML = templateHTML.replace(
      "{{body}}",
      `Đơn hàng ${orderId} đã được giao thành công, hãy đánh giá để nêu lên cảm nhận của bạn về sản phẩm nhé!`
    );

    const sendOTP = await sendEmail({
      email: email,
      subject: `Đơn hàng ${orderId} đã giao thành công`,
      message: templateHTML,
    });

    return sendOTP;
  };
  static sendEmailOrderCancelledStatus = async ({ email, orderId }) => {
    let templateHTML = templateEmailDefault.replace("{{title}}", `Đơn hàng ${orderId} đã bị hủy`);
    templateHTML = templateHTML.replace("{{name}}", "bạn");
    templateHTML = templateHTML.replace("{{home_page}}", "http://localhost:3005");
    templateHTML = templateHTML.replace("{{body}}", `Đơn hàng ${orderId} đã bị hủy, vui lòng liên hệ quản trị để được hỗ trợ!`);

    const sendOTP = await sendEmail({
      email: email,
      subject: `Đơn hàng ${orderId} đã bị hủy`,
      message: templateHTML,
    });

    return sendOTP;
  };
  static sendEmailCreateOrder = async ({ email, orderData }) => {
    let templateHTML = templateCreateOrder.replace("{{title}}", "Tạo đơn hàng thành công");
    templateHTML = templateHTML.replaceAll("{{order_id}}", orderData.order_id);
    templateHTML = templateHTML.replace("{{order_date}}", convertDateTime(orderData.order_date));
    templateHTML = templateHTML.replace("{{order_address}}", orderData.order_address);
    templateHTML = templateHTML.replace("{{order_note}}", orderData.order_note);
    templateHTML = templateHTML.replace("{{sub_total}}", convertMoney(orderData.sub_total));
    templateHTML = templateHTML.replace("{{shipping_cost}}", convertMoney(orderData.shipping_cost));
    templateHTML = templateHTML.replace("{{discount_amount}}", convertMoney(orderData.discount_amount));
    templateHTML = templateHTML.replace("{{total}}", convertMoney(orderData.total));
    templateHTML = templateHTML.replaceAll("{{home_page}}", "http://localhost:3005");
    templateHTML = templateHTML.replace("{{body}}", `Tạo đơn hàng thành công, vui lòng chờ xác nhận.`);

    const templateOrderItem = `<tr>
    <td align="left" style="Margin:0;padding-top:5px;padding-bottom:10px;padding-left:20px;padding-right:20px"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:100px" valign="top"><![endif]-->
        <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
            <tbody><tr>
                <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:100px">
                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tbody><tr>
                            <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;font-size:0px"><a href="{{link_product}}" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#3B8026;font-size:14px"><img class="p_image" src="{{product_image}}" alt="{{product_name}}" width="100" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="{{product_name}}"></a> </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody></table> <!--[if mso]></td><td style="width:20px"></td><td style="width:440px" valign="top"><![endif]-->
        <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
            <tbody><tr>
                <td align="left" style="padding:0;Margin:0;width:440px">
                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tbody><tr>
                            <td align="left" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%" class="cke_show_border" cellspacing="1" cellpadding="1" border="0">
                                    <tbody><tr>
                                        <td style="padding:0;Margin:0">
                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px"><b>{{product_name}}</b> </p>
                                        </td>
                                        <td style="padding:0;Margin:0;text-align:center" width="15%">
                                            <p class="p_quantity" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">{{product_quantity}}</p>
                                        </td>
                                        <td style="padding:0;Margin:0;text-align:center" width="30%">
                                            <p class="p_price" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">{{product_totalAmount}}</p>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" style="padding:0;Margin:0">
                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#999999;font-size:14px" class="p_option">{{product_color}} / {{product_size}}</p>
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody></table> <!--[if mso]></td></tr></table><![endif]-->
    </td>
</tr>`;
    const listOrderItems = [];

    orderData.listItems.forEach((item) => {
      let template = templateOrderItem;

      template = template.replaceAll("{{product_name}}", item.product_name);
      template = template.replace("{{product_quantity}}", item.product_quantity);
      template = template.replace("{{product_totalAmount}}", convertMoney(item.product_totalAmount));
      template = template.replace("{{product_color}}", item.product_color);
      template = template.replace("{{product_size}}", item.product_size);
      template = template.replace("{{product_image}}", item.product_image);

      listOrderItems.push(template);
    });

    templateHTML = templateHTML.replace("{{order_items}}", listOrderItems.join(" "));

    const sendOTP = await sendEmail({
      email: email,
      subject: "Tạo đơn hàng thành công",
      message: templateHTML,
    });

    return sendOTP;
  };
}
module.exports = EmailService;
