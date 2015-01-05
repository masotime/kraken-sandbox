var FieldWidget = React.createClass({displayName: 'FieldWidget',
    getDefaultProps: function() {
        return {
            className: '',
            label: ''
        };
    },
    onClick: function(e) {
        e.preventDefault();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }, render: function() {
        return (
            React.createElement("button", {tabIndex: "-1", className: this.props.className, onClick: this.onClick}, this.props.label)
        );
    }
});