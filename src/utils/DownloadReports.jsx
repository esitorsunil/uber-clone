// components/DownloadReports.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DownloadReports = ({ rides }) => {
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });

    doc.setFontSize(18);
    doc.text('Admin Ride Report', 40, 40);

    const headers = [
      [
        'Ride ID',
        'Pickup',
        'Drop',
        'Distance (km)',
        'Assigned To',
        'Status',
        'Start Date',
        'Start Time',
        'End Date',
        'End Time',
      ],
    ];

    const rows = rides.map((ride) => {
      const user = ride.assignedUsers?.find(
        (u) => u.status === 'ongoing' || u.status === 'completed'
      );
      const assignedTo = user?.username || 'Unassigned';

      const startTime = user?.startTime ? new Date(user.startTime) : null;
      const endTime = user?.endTime ? new Date(user.endTime) : null;

      const startDateStr = startTime ? startTime.toLocaleDateString() : '—';
      const startTimeStr = startTime ? startTime.toLocaleTimeString() : '—';
      const endDateStr = endTime ? endTime.toLocaleDateString() : '—';
      const endTimeStr = endTime ? endTime.toLocaleTimeString() : '—';

      return [
        ride.id,
        ride.pickup?.address || '—',
        ride.drop?.address || '—',
        ride.distance || '—',
        assignedTo,
        ride.status,
        startDateStr,
        startTimeStr,
        endDateStr,
        endTimeStr,
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: headers,
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [32, 122, 199], textColor: 255 },
      margin: { top: 60 },
    });

    doc.save('admin-rides.pdf');
  };

  const exportExcel = () => {
    const data = rides.map((ride) => {
      const user = ride.assignedUsers?.find(
        (u) => u.status === 'ongoing' || u.status === 'completed'
      );
      const assignedTo = user?.username || 'Unassigned';

      const startTime = user?.startTime ? new Date(user.startTime) : null;
      const endTime = user?.endTime ? new Date(user.endTime) : null;

      const startDateStr = startTime ? startTime.toLocaleDateString() : '—';
      const startTimeStr = startTime ? startTime.toLocaleTimeString() : '—';
      const endDateStr = endTime ? endTime.toLocaleDateString() : '—';
      const endTimeStr = endTime ? endTime.toLocaleTimeString() : '—';

      return {
        'Ride ID': ride.id,
        Pickup: ride.pickup?.address || '—',
        Drop: ride.drop?.address || '—',
        'Distance (km)': ride.distance || '—',
        'Assigned To': assignedTo,
        Status: ride.status,
        'Start Date': startDateStr,
        'Start Time': startTimeStr,
        'End Date': endDateStr,
        'End Time': endTimeStr,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admin Rides');
    XLSX.writeFile(workbook, 'admin-rides.xlsx');
  };

  return (
    <div className="d-flex gap-2 my-3">
      <button className="btn btn-outline-dark" onClick={exportPDF}>
        <i className="bi bi-file-earmark-pdf me-1" />
        Report PDF
      </button>
      <button className="btn btn-outline-success" onClick={exportExcel}>
        Report Excel
      </button>
    </div>
  );
};

export default DownloadReports;
