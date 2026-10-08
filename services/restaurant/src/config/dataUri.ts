//We are using dataUri because when we send data to cloud we need to send it as a buffer as cloud only accepts buffer 
// so thats why dataUri is used as it simplify this task

import DataUriParser from "datauri/parser.js";
import path from 'path';

const getBuffer = (file: any) => {
    const parser = new DataUriParser();

    const extName = path.extname(file.originalname).toString();

    return parser.format(extName, file.buffer);
};

export default getBuffer;