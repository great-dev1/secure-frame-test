import * as yup from "yup";

export const bookingValidator = yup.object({
    email: yup.string().trim().email().required(),
});
