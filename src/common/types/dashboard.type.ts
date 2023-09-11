export type CvByMonth = {
	month: string;
	count: number;
};

export type ChartCv = {
	campaign_id: number;
	campaign_name: string;
	cvByMonth: CvByMonth[];
};
