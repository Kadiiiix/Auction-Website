import React from "react";

function AuctionItem({ item }) {
  const {
    picture,
    name,
    condition,
    category,
    closingDate,
    additionalPhotos,
    startingBid,
    allowInstantPurchase,
    description,
    location,
    age,
  } = item; // Destructure item object

  return (
    <div style={styles.container}>
      <img src={picture} alt={name} style={styles.image} />
      <div style={styles.info}>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Condition:</strong> {condition}
        </p>
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Closing Date:</strong>{" "}
          {new Date(closingDate).toLocaleDateString()}
        </p>
        {/* Render other properties as needed */}
        <p>
          <strong>Description:</strong> {description}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Age:</strong> {age}
        </p>
        {/* Additional photos */}
        {additionalPhotos && additionalPhotos.length > 0 && (
          <div>
            <p>
              <strong>Additional Photos:</strong>
            </p>
            <div style={styles.additionalPhotos}>
              {additionalPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Additional Photo ${index + 1}`}
                  style={styles.additionalPhoto}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ccc",
    marginBottom: "20px",
    padding: "10px",
    maxWidth: "500px",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  },
  info: {
    textAlign: "left",
  },
  additionalPhotos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  additionalPhoto: {
    width: "100px",
    height: "auto",
    marginRight: "5px",
    marginBottom: "5px",
  },
};

export default AuctionItem;
