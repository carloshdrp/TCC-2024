import { apiSlice } from "../apiSlice";

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (filter, options) => {
        const params = new URLSearchParams({
          ...filter,
          ...options,
        }).toString();
        return `/reports?${params}`;
      },
    }),
    createReport: builder.mutation({
      query: (report) => ({
        url: "/reports",
        method: "POST",
        body: report,
      }),
    }),
    deleteReport: builder.mutation({
      query: (reportId) => ({
        url: `/reports`,
        method: "DELETE",
        body: { reportId },
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useDeleteReportMutation,
} = reportApiSlice;
