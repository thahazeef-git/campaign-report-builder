const loadMockAdapter = async () => {
  const module = await import('axios-mock-adapter');
  return module.default;
};

const loadHtml2Canvas = async () => {
  const module = await import('html2canvas');
  return module.default;
};

const loadJsPDF = async () => {
  const module = await import('jspdf');
  return module.default;
};

export const setupMockApi = async (api) => {
  const MockAdapter = await loadMockAdapter();
  const mock = new MockAdapter(api);

  mock.onGet('/chart-data').reply((config) => {
    const urlParams = new URLSearchParams(config.params);
    const color = urlParams.get('color');
    const component = urlParams.get('component');
    const campaignName = urlParams.get('campaignName');
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const deviceType = urlParams.get('deviceType');

    // Mock data for different components
    const componentData = {
      'Impressions': [
        { campaignName: 'campaign1', date: '2024-01-01', deviceType: 'mobile', data: [65, 59, 80, 81, 56, 55, 40] },
        { campaignName: 'campaign2', date: '2024-03-01', deviceType: 'desktop', data: [75, 69, 90, 91, 66, 65, 50] },
      ],
      'Click-Through Rate (CTR)': [
        { campaignName: 'campaign1', date: '2024-01-01', deviceType: 'mobile', data: [15, 49, 70, 91, 66, 55, 20] },
        { campaignName: 'campaign2', date: '2024-09-01', deviceType: 'desktop', data: [35, 99, 11, 105, 86, 85, 70] },
      ],
      'Cost-Per-Acquisition (CPA)': [
        { campaignName: 'campaign3', date: '2023-12-15', deviceType: 'mobile', data: [85, 79, 100, 101, 76, 75, 60] },
        { campaignName: 'campaign4', date: '2024-04-15', deviceType: 'desktop', data: [95, 89, 110, 111, 86, 85, 70] },
      ],
      'Conversions': [
        { campaignName: 'campaign3', date: '2024-02-10', deviceType: 'mobile', data: [65, 79, 30, 95, 60, 57, 70] },
        { campaignName: 'campaign4', date: '2024-05-10', deviceType: 'desktop', data: [45, 49, 41, 95, 96, 25, 10] },
      ]
    };

    // Default data if component is not specified
    const defaultData = [
      { campaignName: 'Default Campaign', date: '2023-01-01', deviceType: 'mobile', data: [45, 39, 60, 61, 46, 45, 30] },
    ];

    // Select data based on component
    const data = componentData[component] || defaultData;

    // Filter data based on query parameters
    const filteredData = data.filter((item) => {
      const matchesCampaignName = campaignName ? item.campaignName.includes(campaignName) : true;
      const matchesStartDate = startDate ? new Date(item.date) >= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(item.date) <= new Date(endDate) : true;
      const matchesDeviceType = deviceType ? item.deviceType === deviceType : true;
      return matchesCampaignName && matchesStartDate && matchesEndDate && matchesDeviceType;
    });

    // Aggregate filtered data
    const aggregatedData = filteredData.reduce(
      (acc, item) => {
        acc.labels = ['Ad1', 'Ad2', 'Ad3', 'Ad4', 'Ad5', 'Ad6', 'Ad7'];
        acc.datasets[0].data = acc.datasets[0].data.map((value, index) => value + item.data[index]);
        acc.datasets[0].borderRadius = 10;
        acc.datasets[0].barThickness = 10;
        return acc;
      },
      {
        labels: [],
        datasets: [
          {
            label: component || 'Filtered Data',
            backgroundColor: color || 'rgba(75,192,192,0.4)',
            data: [0, 0, 0, 0, 0, 0, 0]
          },
        ],
      }
    );

    return [200, aggregatedData];
  });
};

export const exportToPDFAndPNG = async () => {
  const html2canvas = await loadHtml2Canvas();
  const jsPDF = await loadJsPDF();
  const reportBuilder = document.querySelector(`.dropzone`);

  html2canvas(reportBuilder).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'report.png';
    link.click();
    const doc = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save('report.pdf');
  });
};

export const availableComponents = ['Impressions', 'Click-Through Rate (CTR)', 'Cost-Per-Acquisition (CPA)', 'Conversions'];