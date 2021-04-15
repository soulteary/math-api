const mathjax = require("mathjax");
const MathJax = mathjax.init({ loader: { load: ["input/tex", "output/svg"] } });

/**
 * Render math.
 *
 * @param {Input} event Input event.
 * @returns {Promise<Output>}
 */
exports.render = (source) => {
    return new Promise((resolve, reject) => {
        MathJax.then((MathJax) => {
            const svg = MathJax.tex2svg(source);
            const ret = MathJax.startup.adaptor.outerHTML(svg) || "";
            resolve(ret.slice(56, -16));
        }).catch((err) => {
            console.error(err);
            throw new Error(`Invalid output: ${source || ""}`);
        });
    });
};

/**
 * Render math for AWS API Gateway.
 *
 * @param {ApiGatewayProxyEvent} event Incoming event.
 * @returns {Promise<ApiGatewayProxyResponse>}
 */
exports.handler = async (event) => {
    try {
        let input = event.queryStringParameters.source;
        const data = await this.render(input);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/svg+xml",
            },
            body: data,
            isBase64Encoded: false,
        };
    } catch (err) {
        if (!(err instanceof Error)) {
            throw new Error(err);
        }
        if (
            !(err instanceof SyntaxError) &&
            !err.message.startsWith("Invalid ")
        ) {
            throw err;
        }

        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: err.message }),
        };
    }
};
