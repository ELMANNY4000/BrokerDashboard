// This is a placeholder Netlify function to handle API requests
// Since our application is client-side only, we don't actually need server functionality
// All data is handled in the browser's memory

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "This is a static site. All functionality is client-side." })
  };
};