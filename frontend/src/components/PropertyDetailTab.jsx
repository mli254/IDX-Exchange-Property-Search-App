export default function PropertyDetailTab({ features }) {
  return (
    <div className="grid grid-cols-2 grid-row-dense gap-3 mt-5">
      {features.length > 0 ? (
        features.map((feature, index) => (
          <p className={`col-${(index % 2) + 1}`} key={index}>
            <span className="block font-bold text-base sm:text-base mt-3 mb-2">
              {feature.desc}
            </span>
            <span className="block text-xs/7 sm:text-sm/7">
              {Array.isArray(feature.value)
                ? feature.value.map((featureDetail, index) => (
                    <span key={index} className="">
                      {featureDetail}
                      <br />
                    </span>
                  ))
                : feature.value}
            </span>
          </p>
        ))
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
}