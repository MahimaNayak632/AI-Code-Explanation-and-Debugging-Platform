import { useEffect, useState } from "react";

export default function SavedCodes() {

  const [savedCodes, setSavedCodes] = useState([]);

  useEffect(() => {

    const codes =
      JSON.parse(localStorage.getItem("savedCodes")) || [];

    setSavedCodes(codes);

  }, []);

  return (

    <div className="container py-4">

      <h2 className="mb-4">
        Saved Codes
      </h2>

      {savedCodes.length === 0 ? (

        <p>No saved codes found</p>

      ) : (

        savedCodes.map((item) => (

          <div
            key={item.id}
            className="card p-3 mb-3"
          >

            <h5>
              {item.language}
            </h5>

            <small className="text-muted">
              {item.createdAt}
            </small>

            <pre
              className="bg-dark text-light p-3 mt-3 rounded"
              style={{
                overflowX: "auto"
              }}
            >
              {item.code}
            </pre>

          </div>
        ))
      )}
    </div>
  );
}