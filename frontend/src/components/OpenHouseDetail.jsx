import { formatDate, formatTime } from "../utils/helper";

function parseRemarksJSON(all_data) {
  const data = JSON.parse(all_data);
  return data.OpenHouseRemarks;
}

export default function OpenHouseDetail({ openhouse }) {
  const remarks = parseRemarksJSON(openhouse.all_data);
  return (
    <div className="bg-gray-100 p-2 mb-3 rounded-lg">
      <p>
        <strong>Start Date:</strong>{" "}
        {formatDate(openhouse.OpenHouseDate) || "N/A"}
      </p>
      <p>
        <strong>Start Time:</strong>{" "}
        {formatTime(openhouse.OH_StartTime) || "N/A"}
      </p>
      <p>
        <strong>End Time:</strong> {formatTime(openhouse.OH_EndTime) || "N/A"}
      </p>
      {remarks && (
        <>
          <h3 className="mt-5 mb-2 text-xl font-[600]">Details:</h3>
          <p className="mb-3">{remarks}</p>
        </>
      )}
    </div>
  );
}