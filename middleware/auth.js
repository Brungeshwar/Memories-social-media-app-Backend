import jwt from "jsonwebtoken";

const secret = "brungi";

const auth = async (req, res, next) => {
  try {
    //console.log("ddd");
    //console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      const decodedData = jwt.verify(token, secret);
      //console.log(decodedData);
      req.userId = decodedData?.id;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
