import Swal from "sweetalert2";

/**
 * Show a SweetAlert2 modal.
 * @param {Object} options
 * @param {"success"|"error"|"warning"|"info"|"question"} options.type - The type of alert.
 * @param {string} options.title - The title of the alert.
 * @param {string} options.text - The text/body of the alert.
 * @param {Object} [options.config] - Additional SweetAlert2 config options.
 * @returns {Promise<SweetAlertResult>} - The result of the modal.
 */
export default function SweetAlert({ type = "info", title = "", text = "", config = {} }) {
  return Swal.fire({
    icon: type,
    title,
    text,
    ...config,
  });
}
