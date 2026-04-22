import { useState } from "react";
import { reportPostAction } from "../../redux/actions/communityActions";
import { useDispatch } from "react-redux";

import { Dialog } from "@headlessui/react";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";

const ReportPostModal = ({
  isOpen,
  onClose,
  postId,
  communityId,
  setReportedPost,
}) => {
  const [reportReason, setReportReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleReportSubmit = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        reportPostAction({
          postId,
          reportReason,
          communityId,
        })
      );
      setIsLoading(false);
      setReportedPost(true);
      onClose();
    } catch (error) {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="inline-block align-middle transform transition-all w-full mx-4 md:max-w-lg overflow-hidden rounded-3xl glass-card border border-white/10 shadow-2xl p-6">
          <Dialog.Title
            as="h3"
            className="text-2xl font-bold leading-6 text-white mb-6 border-b border-white/10 pb-4"
          >
            Report Content
          </Dialog.Title>

          <div className="space-y-4">
            <label
              htmlFor="report-reason"
              className="block text-sm font-semibold text-white/50 uppercase tracking-wider"
            >
              Reason for report
            </label>
            <div className="mt-1">
              <textarea
                name="report-reason"
                className="block w-full text-sm rounded-xl h-32 resize-none p-4 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-v-red/50 transition-all"
                id="report-reason"
                placeholder="Why are you reporting this post?"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-3 mt-8">
            <button
              disabled={isLoading || !reportReason}
              type="button"
              className={`flex-1 inline-flex justify-center items-center px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(250,38,38,0.1)] ${
                isLoading || !reportReason
                  ? "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                  : "bg-v-red text-white hover:bg-v-maroon hover:scale-[1.02] shadow-[0_0_30px_rgba(250,38,38,0.3)]"
              } focus:outline-none`}
              onClick={handleReportSubmit}
            >
              {isLoading ? (
                <ButtonLoadingSpinner loadingText={"Reporting..."} />
              ) : (
                "Submit Report"
              )}
            </button>

            <button
              type="button"
              className="flex-1 inline-flex justify-center px-6 py-3 text-sm font-semibold text-white/50 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 transition-all focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ReportPostModal;
