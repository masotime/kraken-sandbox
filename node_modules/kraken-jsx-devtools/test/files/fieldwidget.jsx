var FieldWidget = React.createClass({
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
            <button tabIndex="-1" className={this.props.className} onClick={this.onClick}>{this.props.label}</button>
        );
    }
});