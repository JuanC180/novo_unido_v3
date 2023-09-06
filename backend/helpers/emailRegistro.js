
const nodemailer = require('nodemailer')

const emailRegistro = async (datos) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, apellido, estado, token } = datos;

  const info = await transporter.sendMail({
    from: "novotic.notificaciones@gmail.com",
    to: email,
    subject: "Comprobar cuenta en Novotic",
    text: "",
  //   html: `<p style="font-size: 16px; color: #333;">Hola: ${nombre}, comprueba tu correo electrónico.</p>
  //     <p style="font-size: 14px;">Tu cuenta está lista, comprobar en el siguiente enlace:
  //     <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="color: blue; text-decoration: none;">comprobar cuenta</a></p>

  //     <p style="font-size: 12px; color: #999;">Si no eres quien ha creado la cuenta, ignora este mensaje.</p>
  // `,
  html: `
  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color: rgb(238, 238, 240); margin:0;padding:0;table-layout:fixed;border-spacing:0;border-collapse:collapse;width:100%!important;min-width:100%;color:#0a0836;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:1.5" bgcolor="#f6fafb">
  <tbody>
      <tr style="padding:0">
          <td style="display:none!important;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden"></td>
          <td align="center" valign="top" style="padding:10px 10px 0;word-break:break-word;border-collapse:collapse!important"><a rel="noopener noreferrer" href="" style="color:#00b08c!important" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://novitic.io&amp;source=gmail&amp;ust=1692494115601000&amp;usg=AOvVaw0bP-o8Gk6NgHs8iyNnBD_8"><img alt="Novotic" title="Novotic" src="https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg" style="border:none;width:130px!important;max-width:100%;outline:none;text-decoration:none;vertical-align:middle;height:38px!important" class="CToWUd" data-bit="iit"></a></td>
      </tr>
      <tr style="padding:0">
          <td align="center" valign="top" style="margin:0;padding:20px 10px 30px;word-break:break-word;border-collapse:collapse!important;width:100%!important;min-width:100%">
              <table border="0" cellpadding="0" cellspacing="0" width="580" style="padding:0;table-layout:auto;border-spacing:0;border-collapse:collapse;border-radius:10px" bgcolor="#fff">
                  
                  <tbody>
                      <tr style="padding:0">
                          <td align="left" class="m_7304439990103367481content" style="padding:30px 40px;word-break:break-word;border-collapse:collapse!important">
                              <p style="font-size:14px bold">Hola, <strong>${nombre}</strong>,<br>Comprueba tu correo electrónico.</p>
                              <p style="font-size:14px">Tu cuenta está lista, comprobar en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}" target="_blank"> <div style="text-align: center; margin-top: 20px;">
                                <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="text-decoration: none; ">
                                  <button style="background-color: rgb(26, 115, 231); color: white; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-weight: bold; border: none;">
                                    Activar cuenta
                                  </button>
                                </a>
                              </div></a></p>

                              <p style="font-size: 14px; color: #999;">Si no eres quien ha creado la cuenta, ignora este mensaje.</p>

                          </td>
                      </tr>
                      <tr style="padding:0">
                          <td align="left" valign="middle" class="m_7304439990103367481inner-footer m_7304439990103367481is-marketing" style="padding:0 40px;word-break:break-word;border-collapse:collapse!important">
                              
                              <table border="0" cellpadding="0" cellspacing="0" width="50%" style="padding:0;table-layout:auto;border-spacing:0;border-collapse:collapse;border-top-width:1px;border-top-color:#e4e4e9;border-top-style:solid">
                                  <tbody>
                                      <tr style="padding:0">
                                          <td align="left" valign="middle" style="padding:20px 0;word-break:break-word;border-collapse:collapse!important;width:64px"><img alt="Contact person" title="Contact person" src="https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg" style="border:none;width:46px!important;max-width:100%;outline:none;text-decoration:none;vertical-align:middle;height:46px!important" class="CToWUd" data-bit="iit"></td>
                                          <td align="left" valign="middle" style="padding:0;word-break:break-word;border-collapse:collapse!important;border-top-width:1px;border-top-color:#e4e4e9;border-top-style:solid;font-size:12px;line-height:1.5"> Disfruta usando nuestro producto!<br><strong>Novotic</strong>   </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
      </tr>
      <tr style="padding:0">
          <td align="center" valign="top" style="padding:0 10px 10px;word-break:break-word;border-collapse:collapse!important">
              <table border="0" cellpadding="0" cellspacing="0" width="580" style="padding:0;table-layout:auto;border-spacing:0;border-collapse:collapse">
                  <tbody>
                      <tr style="padding:0">
                          <td align="center" valign="top" class="m_7304439990103367481footer" style="padding:0;word-break:break-word;border-collapse:collapse!important;font-size:11px;color:#8d8c9f">
                              
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_7304439990103367481footer" style="padding:0;table-layout:auto;border-spacing:0;border-collapse:collapse;font-size:11px;color:#8d8c9f">
                                  <tbody>
                                      <tr style="padding:0">
                                          <td align="left" valign="middle" class="m_7304439990103367481footer-section" style="padding:0;word-break:break-word;border-collapse:collapse!important"> NOVOMATIC AG is licensed and<br>  regulated in GreatBritain by the Gambling Commission under account<br> number 45352. </td>
                                          <td align="left" valign="middle" class="m_7304439990103367481footer-section" style="padding:0;word-break:break-word;border-collapse:collapse!important;width:175px">  <span class="il"></span><br><a rel="noopener noreferrer" href="https://u286553246.t.Novotic.click/out/OZZ%2F5b83SuOqnh+tkH8DGY8pNgAyxxpWhAEeUWdTFe3kdrR8OOG+omMpSYKJDfUI5W4iJvYAkONxCcjqJi7Yd2nTgQvR3mIo6m5UJXwbf2pZbohoHUBNrYyLthApfN%2FscrggpS7knce2Sh+1QzSQqWhPpiU5lBWSFthDaH5zb+t0z4foQcEldzKlbQpBUJBI9o59IsU%2F+LMKbqmgW8CfiHXsnh4Y6xLvlH2ND29FX6va8vzlwA0JYJNR4NTG27MLFXQ=--ZPvZ7I7%2FVaQ4dYDk--oMSPxfMmjf7uIEqGiWgJmA==" style="color:#8d8c9f!important" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://u286553246.t.novitic.click/out/OZZ%252F5b83SuOqnh%2BtkH8DGY8pNgAyxxpWhAEeUWdTFe3kdrR8OOG%2BomMpSYKJDfUI5W4iJvYAkONxCcjqJi7Yd2nTgQvR3mIo6m5UJXwbf2pZbohoHUBNrYyLthApfN%252FscrggpS7knce2Sh%2B1QzSQqWhPpiU5lBWSFthDaH5zb%2Bt0z4foQcEldzKlbQpBUJBI9o59IsU%252F%2BLMKbqmgW8CfiHXsnh4Y6xLvlH2ND29FX6va8vzlwA0JYJNR4NTG27MLFXQ%3D--ZPvZ7I7%252FVaQ4dYDk--oMSPxfMmjf7uIEqGiWgJmA%3D%3D&amp;source=gmail&amp;ust=1692494115602000&amp;usg=AOvVaw2khqjoVzILv8raNT5WBikF"></a>  <a rel="noopener noreferrer" href="mailto:support@novitic.io" style="color:#8d8c9f!important" target="_blank"></a></td>
                                          <td align="right" valign="middle" class="m_7304439990103367481footer-section" style="padding:0;word-break:break-word;border-collapse:collapse!important">
                                              <table border="0" cellpadding="0" cellspacing="0" class="m_7304439990103367481scl-block" style="padding:0;table-layout:auto;border-spacing:0;border-collapse:collapse">
                                                  <tbody>
                                                      <tr style="padding:0">
                                                          <td align="right" valign="middle" class="m_7304439990103367481scl-item" style="padding:0;word-break:break-word;border-collapse:collapse!important;width:60px"><a rel="noopener noreferrer" class="m_7304439990103367481scl-link" href="https://www.facebook.com/NOVOMATIC" style="color:#313a45!important;opacity:0.5" target="_blank"><img alt="Facebook" title="Facebook" src="https://ci6.googleusercontent.com/proxy/t7ro-We5O8glkjtivA1tgdgyyuM2YAJlYlmu7QZzaVhpcdtP8IcKhqHc9kUmlrfO8iOv8ZJphLW9rQOrri6SpVDvlcS32ok2SjfqkaN2AlgCApjcGg=s0-d-e1-ft#https://email-assets.novitic.io/onboarding_emails/facebook@2x.png" style="border:none;width:34px!important;max-width:100%;outline:none;text-decoration:none;vertical-align:middle;height:34px!important" class="CToWUd" data-bit="iit"></a></td>
                                                          <td align="right" valign="middle" class="m_7304439990103367481scl-item" style="padding:0;word-break:break-word;border-collapse:collapse!important;width:60px"><a rel="noopener noreferrer" class="m_7304439990103367481scl-link" href="https://twitter.com" style="color:#313a45!important;opacity:0.5" target="_blank" ><img alt="Twitter" title="Twitter" src="https://ci6.googleusercontent.com/proxy/pxfEQgS8tvS3V_yTU9gUxrrtHAiOohk8_rwr8rUswezy9bZaSKiRXRsLqdPn38WcfNjzGmosjmMGLnLu6uvhqgh9Gu7JHUqgkAXWeas9WET9lytK=s0-d-e1-ft#https://email-assets.novitic.io/onboarding_emails/twitter@2x.png" style="border:none;width:34px!important;max-width:100%;outline:none;text-decoration:none;vertical-align:middle;height:34px!important" class="CToWUd" data-bit="iit"></a></td>
                                                          <td align="right" valign="middle" class="m_7304439990103367481scl-item" style="padding:0;word-break:break-word;border-collapse:collapse!important;width:60px"><a rel="noopener noreferrer" class="m_7304439990103367481scl-link" href="https://at.linkedin.com/company/novomatic" style="color:#313a45!important;opacity:0.5" target="_blank" ><img alt="LinkedIn" title="LinkedIn" src="https://ci6.googleusercontent.com/proxy/XtGtUDGa6OanSO9c2c_UZdSF1T7km5s2UeHCmbWSwRwCD2SduXDBZN3ECuaXL5_Zd5OtJzGnN5fycdPR3vCyCplvqmYkhPEsNNg_4PgVHdcpvzLu4w=s0-d-e1-ft#https://email-assets.novitic.io/onboarding_emails/linkedin@2x.png" style="border:none;width:34px!important;max-width:100%;outline:none;text-decoration:none;vertical-align:middle;height:34px!important" class="CToWUd" data-bit="iit"></a></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
      </tr>
  </tbody>
</table>
    
`
  });

      console.log("Mensaje enviado: %s", info.messageId)
}


module.exports = emailRegistro