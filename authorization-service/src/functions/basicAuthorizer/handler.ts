const basicAuthorizer = async (
    event,
    _context,
    callback
): Promise<void> => {
  console.log(`event:`, event);
  console.log(`event:`, JSON.stringify(event));

  if (event.type !== "TOKEN") callback("Unauthorized");

  try {
    const authToken = event.authorizationToken;
    const encodedCreds = authToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const [username, password] = plainCreds;

    console.log(`username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
        storedUserPassword && storedUserPassword === password ? "Allow" : "Deny";
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    callback(null, policy);
  } catch (err) {
    console.log("error", err.message);
    callback("Error: Invalid token");
  }
};


const generatePolicy = (principalId, resourceArn, effect) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resourceArn,
      },
    ],
  },
});

export const main = basicAuthorizer;