import PropTypes from 'prop-types'; 

const SectionCard = ({ icon, title, children }) => (
    <div className="bg-slate-50 rounded-xl p-6 shadow-lg border border-sky-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-opacity-20 rounded-lg">{icon}</div>
        <h3 className="text-xl font-semibold text-sky-900">{title}</h3>
      </div>
      {children}
    </div>
  );

SectionCard.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  const InfoItem = ({ label, value }) => (
    <div className="space-y-1">
      <span className=" text-lg font-medium text-gray-500">{label}</span>
      <p className="text-gray-700">{value}</p>
    </div>
  );
  
  InfoItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  const InfoBox = ({ label, value }) => (
    <div className="bg-sky-50 p-3 rounded-lg">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  );
  
  InfoBox.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };
  
  const VitalSign = ({ label, value }) => (
    <div className="border-l-4  border-blue-100 pl-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-700">{value}</p>
    </div>
  );
  VitalSign.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

export  {SectionCard,InfoItem,VitalSign,InfoBox}  ;