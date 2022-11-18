import { check } from "express-validator";

const schema = [
  check("name", "Grup adı en az 3 karakter olmalıdır.")
    .exists()
    .isLength({ min: 3 }),
];
export {schema as groupSchema};
